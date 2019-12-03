const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Book {
    id: ID
    name: String
    genre: String
    author: Author
  }

  type Author {
    id: ID
    name: String
    age: Int
    books: [Book]
  }

  input AuthorInput {
    id: ID
    name: String
    age: Int
  }

  input BookInput {
    id: ID
    name: String
    genre: String
    author: AuthorInput
  }

  type Query {
    getBooks: [Book]
    getAuthors: [Author]
    getBook(id: ID!): Book
    getAuthor(id: ID!): Author
  }

  type Mutation {
    createBook(input: BookInput): Book
    deleteBook(id: ID!): Book
    updateBook(id: ID!, input: BookInput): Book
  }
`;

const books = [
  {
    id: 1,
    name: "Book1",
    genre: "Horror"
  },
  {
    id: 2,
    name: "Book2",
    genre: "Comedy"
  },
  {
    id: 3,
    name: "Book3",
    genre: "Western"
  },
  {
    id: 4,
    name: "Book4",
    genre: "Horror"
  }
]

const authors = [
  {
    id: 1,
    name: "Name1",
    age: 32,
    books: [
      books[0],
      books[1]
    ]
  },
  {
    id: 2,
    name: "Name2",
    age: 33,
    books: [
      books[2],
      books[3]
    ]
  }
]

var j = 0;
for ( let i = 0; i < 2; i++) {
  books[j].author = authors[0];
  books[j + 1].author = authors[1];
  j = j + 2;
}

const resolvers = {
  Query: {
    getBooks: () => books,

    getAuthors: () => authors,

    getBook: (root, { id }) => {
      return books.find(book => book.id == id);
    },

    getAuthor: (root, { id }) => {
      return books.find(book => book.id == id);
    }
  },
    Mutation: {
      createBook: (root, { input }) => {
        if(!books.find(book => book.id == input.id)){
          books.push(input);
        }
        for (let i = 0; i < authors.length; i++){
          if(authors[i].name === input.author.name){
            input.author = authors[i];
            if(!authors[i].books.find(book => book.id == input.id)) {
              authors[i].books.push(input);
            }
            return input;
          }
        }
        authors.push(input.author);

        const currentAuthor = authors.find(author => author.id == input.author.id);
        currentAuthor.books = [];
        if(!currentAuthor.books.find(book => book.id == input.id)) {
          currentAuthor.books.push(input);
        }
        return input;
      },

      deleteBook: (root, { id }) => {
        const elementPosition = books.findIndex(book => book.id == id);
        const book = books[elementPosition];
        console.log(book);
        if(elementPosition >= 0){
          books.splice(elementPosition, 1);
        }  
        return book;
      },

      // updateBook: (root, {id, input}) => {
        
      // }
    }
  }
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen({ port: 4000 }), () =>
    console.log(`:rocket: Server ready at http://localhost:4000${server.graphqlPath}`)
