var React = require('react');
var Router = require('react-router');
var Repos = require('./Github/Repos');
var UserProfile = require('./Github/UserProfile');
var Notes = require('./Notes/Notes');
var ReactFireMixin = require('reactfire');
var Firebase = require('firebase');
var helpers = require('../utils/helpers');

var Profile = React.createClass({
	mixins: [ReactFireMixin],
  getInitialState: function(){
    return {
      notes: [1,2,3],
      bio: {},
      repos: []
    }
  },
  componentDidMount: function () {
  	this.ref = new Firebase('https://blazing-inferno-2005.firebaseio.com/');
    this.init(this.props.params.username)

  }, //when we receive new props, callback function invoked
  componentWillReceiveProps: function (nextProps) {
    this.unbind('notes'); //unbind when you get new props (new username) *1
    this.init(nextProps.params.username);
  },
  componentWillUnmount: function () {
    //remove listener after the component has unmounted
  	this.unbind('notes');
  },
  init: function (username) {
    //This portion sets up listener for new username
    //pass in username from URL to this.ref.child (firebase db)

    //*1:rebind to new username
    var childRef = this.ref.child(username); 

    //one-way binding from a list of nodes in your Firebase db to an array in this.state
    //bind childRef endpoint to 'notes'
    this.bindAsArray(childRef, 'notes');

    helpers.getGithubInfo(username)
      .then(function(data){
        this.setState({
          bio: data.bio,
          repos: data.repos
        })
      }.bind(this)) //set ".this" context the same    
  },
  handleAddNote: function (newNote) {
    //update firebase with newNote
     this.ref.child(this.props.params.username).child(this.state.notes.length).set(newNote)
  },
  render: function(){
    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={this.props.params.username} bio={this.state.bio} />
        </div>
        <div className="col-md-4">
          <Repos username={this.props.params.username} repos={this.state.repos}/>
        </div>
        <div className="col-md-4">
          <Notes
            username={this.props.params.username}
            notes={this.state.notes}
            addNote={this.handleAddNote} />
        </div>
      </div>
    )
  }
})

module.exports = Profile;