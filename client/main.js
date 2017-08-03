import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import App from '../imports/ui/containers/App';

import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import './main.css';
// import index from '../imports/index';
// import registerServiceWorker from './registerServiceWorker';

Meteor.startup(() => {
    ReactDOM.render(<App />, document.getElementById('root'))
});