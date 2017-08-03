import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data'

import { ToDos } from '../../../api/todos';

import './styles.css';
import AccountsUIWrapper from '../../components/AccountsWrapper/'

 
const ToDoItem = ({ todoProp, toggleComplete, removeToDo }) => (
  <li>{todoProp.title}
    <input
      type="checkbox"
      id={todoProp._id}
      checked={todoProp.complete}
      onChange={() => toggleComplete(todoProp)} />
    <label htmlFor={todoProp._id}></label>
    <button onClick={() => removeToDo(todoProp)}>
      <i className="fa fa-trash"></i>
    </button>
  </li>
);


const ClearButton = ({ removeCompleted }) => (
  <button onClick={removeCompleted}>Clear Completed</button>
);

const ToDoCount = ({ number }) => (
  <p>{number} {number === 1 ? 'To Do' : 'To Dos'}</p>
);

class App extends Component {

  componentDidMount() {
    this.toDoInput.focus();
  }

  // insert
  addToDo = (event) => {
    event.preventDefault();
    // if (this.toDoInput.value) {ToDos.insert({ title: this.toDoInput.value, complete: false, owner: this.props.currentUser._id});}
    if (this.toDoInput.value) {
      Meteor.call('todos.addToDo', this.toDoInput.value)
    }
    this.toDoInput.value = '';
  }

  toggleComplete = (item) => {
    // ToDos.update(item._id, { $set: { complete: !item.complete}})
    Meteor.call('todos.toggleComplete', item)
  }

  // remove
  removeToDo = (item) => {
    // ToDos.remove( item._id );
    Meteor.call('todos.removeToDo', item)
  }

  //remove multiple completed
  removeCompleted = () => {
    // const todoIds = this.props.todos.filter( todo => todo.complete).map(todo => todo._id)
    Meteor.call('todos.removeCompleted')    
  }
  // upadte
  hasCompleted() {
    const completed = this.props.todos.filter(todo => todo.complete);
    return !!completed.length;
  }

  render() {
    const { todos } = this.props;

    return (
      <div className="app-wrapper">
        <div className="login-wrapper">
          <AccountsUIWrapper />
        </div>
        <div className="todo-list">
          <h1>So Much To Do</h1>
          {(!this.props.currentUserId) ? (
            <div className="logged-out-message">
              <p>Please sign in to see your todos.</p>
            </div>
          )
          :
          <div>
            <div className="add-todo">
              <form name="addTodo" onSubmit={this.addToDo}>
                <input type="text" ref={(input) => (this.toDoInput = input)} />
                <span>(press enter to add)</span>
              </form>
            </div>
            <ul>
              {todos.map((todo, index) => (
                <ToDoItem key={index} todoProp={todo} toggleComplete={() => this.toggleComplete(todo)} removeToDo={this.removeToDo} />
              ))}
            </ul>
            <div className="todo-admin">
              <ToDoCount number={todos.length} />
              {this.hasCompleted() &&
                <ClearButton removeCompleted={this.removeCompleted} />
              }
            </div>
          </div>
          }
        </div>
      </div>
    )
  }
}

App.defaultapp = {
  todos: []
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  currentUserId: PropTypes.string,
  currentUser: PropTypes.object
}

ToDoCount.propTypes = {
  number: PropTypes.number.isRequired
};

ClearButton.propTypes = {
  removeCompleted: PropTypes.func.isRequired
};

ToDoItem.propTypes = {
  todoProp: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    complete: PropTypes.bool
  }).isRequired,
  toggleComplete: PropTypes.func.isRequired,
  removeToDo: PropTypes.func.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('todos');

  return{
    currentUser: Meteor.user(), // NEW!
    currentUserId: Meteor.userId(),
    todos: ToDos.find().fetch()
  }
}, App)
