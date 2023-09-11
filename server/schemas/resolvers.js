// resolvers makes all the properties defined in tyeDefs available 
// example: executing the instructions from typeDefs
const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // by using me here, we are specifically associating the Query me in typeDefs
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError ('You need to be logged in!');
        },
        // me is performing the defined properties Query me in typeDefs and since it is returning User, it needs to return all of the properties defined under User
        // whenever you execute the resolver for me, you have to make sure all of the properties on the type User in typeDefs are available
        // the Query me in typeDefs has to have the final data structure of User, here the Query me is performing the actions that will get us the data from Query me in typeDefs which returns the properties of User
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            // if (!user) {
            //     return res.status(400).json({ message: 'Something is wrong!' });
            // }
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            }
            
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { user, body }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
            );
            return updatedUser
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const book = await Book.findOneAndDelete({
                    _id: bookId,
                });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: book._id } } },
                    { new: true }
                );
                return book;
            }
            throw AuthenticationError;
        },
    },
};
module.exports = resolvers;
