import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import NotFound from './components/NotFound';
import Home from './components/Home';
import PatientImages from './components/PatientImages';
import AddImage from './components/AddImage';
import ChatScreen from './components/message/ChatScreen';
import Message from './components/message/Message';
import GeneralInbox from './components/message/GeneralInbox';
import GeneralMessage from './components/message/GeneralMessage';
import CreateChat from './components/CreateChat';
import InsertChatImage from './components/message/InsertChatImage';
import CreateAccount from './components/CreateAccount';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LoginScreen}></Route>
          <Route exact path="/createaccount" component={CreateAccount}></Route>
          <Route exact path="/home" component={Home}></Route>
          <Route exact path="/chats" component={ChatScreen}></Route>
          <Route exact path="/newchat" component={CreateChat}></Route>
          <Route exact path="/manageimages" component={PatientImages}></Route>
          <Route exact path="/addimage" component={AddImage}></Route>
          <Route exact path="/insertImage" component={InsertChatImage}></Route>
          <Route exact path="/messages" component={Message}></Route>
          <Route exact path="/generalmessages" component={GeneralMessage}></Route>
          <Route exact path="/generalInbox" component={GeneralInbox}></Route>
          <Route path="*" component={NotFound}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
