const {ApolloServer, gql} = require('apollo-server');
const Axios = require('axios');
const uuid = require('uuid');
const bluebird = require('bluebird');
const redis = require('redis');
const promise = require('bluebird/js/release/promise');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const UNSPLASH_ACCESS_KEY = '4zY8nDw5WnbdLz495wOq5YtyOveRbDoeW0nRNwuCvaw';
const UNSPLASH_SECRET_KEY = "8egXgitCvxgefSYAco_5N7y2MCDAiIv_swetTcwraFY";

// function stolen almost wholesale from: https://gist.github.com/Jaaromy/1bbe6b3d0416fb6ce13b7ac240141ddd
// Taken in desperation about 3 hours into bugfixing
function scan(match) {
	let cursor = '0';
	let keys = [];

	// Recursive call to Redis SCAN. Recursion continues until cursor = '0'
	function innerscan() {
		return client.scanAsync(cursor, 'MATCH', match ? match : '*', 'COUNT', '10')
			.then(res => {
				cursor = res[0];

				keys.push(...res[1]);

				if (cursor === '0') {
					return keys;
				}

				return innerscan();
			});
	}

	return bluebird.try(innerscan);
}

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
            const images = res.data.map(async (image) => {
                // console.log(image);
                let test = await client.getAsync(image.id);
                if(test) {
                    return JSON.parse(test);
                } else {
                    return {
                        id: image.id,
                        url: image.urls.regular,
                        posterName: image.user.name,
                        description: image.description,
                        userPosted: false,
                        binned: false
                    }
                }
            });
            return images;
        },
        binnedImages: async () => {
            //TODO: rewrite scan to use callback
            let binnedKeys = await scan('*')
            let binnedImages = [];
            for(let key of binnedKeys) {
                let image = await client.getAsync(key);
                let parsedImage = JSON.parse(image);
                console.log(parsedImage);
                if(parsedImage.binned) {
                    binnedImages.push(parsedImage);
                }
            }
            return binnedImages;
        },
        userPostedImages: async () => {
            //TODO: rewrite scan to use callback
            let userPostedKeys = await scan('*')
            let userPostedImages = [];
            for(let key of userPostedKeys) {
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
                id: args.id !== undefined ? args.id : testImg.id,
                url: args.url !== undefined ? args.url : testImg.url,
                posterName: args.posterName !== undefined ? args.posterName : testImg.posterName,
                description: args.description !== undefined ? args.description : testImg.description,
                userPosted: args.userPosted !== undefined ? args.userPosted : testImg.userPosted, 
                binned: args.binned !== undefined ? args.binned : testImg.binned
            };
            if(testImg) {
                if(testImg.binned && !args.binned && !image.userPosted) {
                    console.log(args);
                    //Currently just returning the deleted image, not sure what else to do here
                    await client.delAsync(args.id);
                    return image;
                } else if(args.binned && !testImg.binned) {
                    await client.setAsync(args.id, JSON.stringify(image));
                    return image;
                } else if(args.userPosted || testImg.userPosted) {
                    await client.setAsync(args.id, JSON.stringify(image));
                    return image;
                }
            } else {
                if(args.binned){
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
  console.log(`????  Server ready at ${url} ????`);
});

