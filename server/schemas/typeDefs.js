// typeDefs is where you are defining all the properties that you want to be able through graphQL
// example: defining instructions
const typeDefs = `
type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
}

input BookInput {
    authors: [String]
    description: String
    title: String!
    bookId: String!
    image: String
    link: String
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
}
`
module.exports = typeDefs;
// anything that is put in type is the available data that can be returned
// input - rather than defining every parameter individually, we can create an input type for it so that we define it once and we always know what all the inputs will be
// all the inputs passed under BookInput will be passed through the bookData parameter of saveBook line 42
// ! are for if you always want to return it to the UI - no matter what data is graphed or manipulated from here, you will always expect to receive this specific piece of information
// the purpose of graphQL is to manipulate data in the database and also send back data in a much less demanding way for the backend (you don't have to declare a bunch of routes) 