import { Mongo } from 'meteor/mongo';

export const ToDos = new Mongo.Collection('todos');
// create a todos publication that the client can subscribe to 
if (Meteor.isServer) {
  Meteor.publish('todos', function todosPublication() {
    return ToDos.find({owner: this.userId})
  })
}

// Allow Client to do these things only to this collection...
Meteor.methods({
  // toggling todo as complete/not complete
  'todos.toggleComplete' (todo) {
    if (todo.owner !== this.userId) {
      throw new Meteor.Error('todos.toggleComplete.not-authorized')
        'Your are not authorized to update todo for others'
    }
    ToDos.update(todo._id, { $set: { complete: !todo.complete }})
  },

  // add todo
  'todos.addToDo' (data) {
    // check(text, String)
    if (!this.userId) {
      throw new Meteor.Error('todos.toggleComplete.not-authorized')
        'Your are not authorized to update todo for others'
    }
    ToDos.insert({
      title: data,     
      complete: false,
      owner: this.userId
    })
  },

  //remove todo from list
  'todos.removeToDo' (item) {
    if (item.owner !== this.userId) {
      throw new Meteor.Error('todos.toggleComplete.not-authorized')
        'Your are not authorized to remove todo for others'
    }
    ToDos.remove( item._id );
  },

  //remove completed
   'todos.removeCompleted' () {
    if (!this.userId) {
      throw new Meteor.Error('todos.toggleComplete.not-authorized')
        'Your are not authorized to remove todo for others'
    }
    ToDos.remove({complete: true, owner: this.userId});
  } 
})
