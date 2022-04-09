const {ApolloServer, gql} = require('apollo-server');
const Axios = require('axios');
const redisScan = require('node-redis-scan');
const uuid = require('uuid');
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const UNSPLASH_ACCESS_KEY = '4zY8nDw5WnbdLz495wOq5YtyOveRbDoeW0nRNwuCvaw';
const UNSPLASH_SECRET_KEY = "8egXgitCvxgefSYAco_5N7y2MCDAiIv_swetTcwraFY";

const typeDefs = gql`
    type Query {
        unsplashImages(pageNum: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]
    }

    type ImagePost {
        id: ID!
        url: String!
        posterName: String!
        description: String
        userPosted: Boolean!
        binned: Boolean!
    }

    type Mutation {
        uploadImage(
            url: String!, 
            description: String, 
            posterName: String
        ): ImagePost
        updateImage(
            id: ID!, 
            url: String, 
            posterName: String, 
            description: String, 
            userPosted: Boolean, 
            binned: Boolean
        ): ImagePost
        deleteImage(id: ID!): ImagePost
    }
`;

const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            let res = await Axios.get(`https://api.unsplash.com/photos?page=${args.pageNum}&client_id=${UNSPLASH_ACCESS_KEY}`);
            const images = res.data.map(image => {
                console.log(image);
                return {
                    id: image.id,
                    url: image.urls.regular,
                    posterName: image.user.name,
                    description: image.description,
                    userPosted: false,
                    binned: false
                }
            });
            return images;
        },
        binnedImages: async () => {
            //TODO: test this thouroughly, probably completely broken
            const scan = new redisScan(client);
            const keys = await scan.scan('*');
            let binnedImages = [];
            for(let key of keys) {
                let image = await client.getAsync(key);
                binnedImages.push(JSON.parse(image));
            }
            return binnedImages;
        },
        userPostedImages: async () => {
            //same concept as before, but only take images where userPosted is true
            const scan = new redisScan(client);
            const keys = await scan.scan('*');
            let userPostedImages = [];
            for(let key of keys) {
                let image = await client.getAsync(key);
                let parsedImage = JSON.parse(image);
                if(parsedImage.userPosted) {
                    userPostedImages.push(parsedImage);
                }
            }
            return userPostedImages;
        }
    },
    Mutation: {
        uploadImage: async (_, args) => {
            const id = uuid.v4();
            const image = {
                id: id,
                url: args.url,
                posterName: args.posterName,
                description: args.description,
                userPosted: true,
                binned: false
            };
            await client.setAsync(id, JSON.stringify(image));
            return image;
        },
        updateImage: async (_, args) => {
            let testImg = await client.getAsync(args.id);
            testImg = JSON.parse(testImg);
            const image = {
                id: args.id,
                url: args.url,
                posterName: args.posterName,
                description: args.description,
                userPosted: args.userPosted,
                binned: args.binned
            };
            if(testImg) {
                if(testImg.binned && !args.binned && !args.userPosted) {
                    //Currently just returning the deleted image, not sure what else to do here
                    await client.delAsync(args.id);
                    return testImg;
                } else if(args.binned && !testImg.binned) {
                    await client.setAsync(args.id, JSON.stringify(image));
                    return image;
                }
            } else {
                if(args.binned){
                    //pull image data from react state
                    await client.setAsync(args.id, JSON.stringify(image));
                    return image;
                }
            }
            return image;
        },
        deleteImage: async (_, args) => {
            const image = await client.getAsync(args.id);
            if(image) {
                await client.delAsync(args.id);
                return JSON.parse(image);
            } else {
                throw new Error('Image not found');
            }
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});

