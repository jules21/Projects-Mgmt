// const { clients, projects } = require('../sampleData')
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType
} = require('graphql')
const Client = require('../models/Client')
const Project = require('../models/Project')

// ClientType
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
  }),
})

// ProjectType
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name:{
      type: GraphQLString
    },
    description:{
      type: GraphQLString
    },
    status:{
      type:GraphQLString
    },
    client:{
      type: ClientType,
      resolve(parent, args){
        return Client.findById(parent.clientId)
      }
    }
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find()
      },
    },
    client: {
      type: ClientType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve(parent, args) {
        return Client.findById(args.id)
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args){
        return Project.find();
      }
      
    },
    Project:{
      type:ProjectType,
      args:{id:{type: GraphQLID}},
      resolve(parent, args){
        return Project.findById(args.id)
      }
    }
  },
})

const mutation = new GraphQLObjectType({
  name:'mutation',
  fields:{
    addNewClient:{
      type: ClientType,
      args:{
        name: {type: GraphQLNonNull(GraphQLString)},
        email: {type: GraphQLNonNull(GraphQLString)},
        phone: {type: GraphQLNonNull(GraphQLString)},
      },
      resolve(parent,args){
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        })
        return client.save()
      }
    },
    deleteClient:{
      type: ClientType,
      args:{
        id:{type:GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args){
        return Client.findOneAndRemove(args.id)
      }
    },
    addProject:{
      type: ProjectType,
      args:{
        name: {type: GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLNonNull(GraphQLString)},
        status: {
          type: new GraphQLEnumType({
          name:"ProjectStatus",
          values :{
            new : { value: "Not Started"},
            progress: {value: "In Progress"},
            completed: {value: "Completed"}
          },
          defaultValue:"Not Started"
        })
      },
      clientId: {type: GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args){
        const project = new Project({
          name:args.name,
          description:args.description,
          status:args.status,
          clientId:args.clientId,
        })

        return project.save()
      }
    },
    updateProject:{
      type:ProjectType,
      args:{
        id: {type: GraphQLNonNull(GraphQLID)},
        name:{type: GraphQLString},
        description:{type: GraphQLString},
        status:{
          type: new GraphQLEnumType({
            name:"projectStatusUpdate",
            values: {
              new: {value: "Not Started"},
              progress: {value: "In Progress"},
              completed: {value: "Completed"},
            }
          })
        },
        clientId:{type:GraphQLID}
      },
      resolve(parent, args){
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set:{
              name: args.name,
              description:args.description,
              status: args.status,
              clientId:args.clientId
            }
          },
          {new:true}
        )
      }
    },
    deleteProject:{
      type: ProjectType,
      args:{
        id:{type:GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args){
        return Project.findOneAndRemove(args.id)
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
