import React,{useState, useEffect} from 'react';
import { FormControl, Input } from '@mui/material';    
import './App.css';
import Message from './Message';
import db from './firebase';
import firebase from 'firebase/compat/app';                            
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';

function App() {

  const[input, setInput] = useState('');
  const[messages, setMessages]= useState([]);
  const[username, setUsername] = useState('');

//useState =variable in React
//useEffect = run code on a condition in React 

useEffect(() =>  {
  db.collection("messages")
    .orderBy("timestamp","desc")
    .onSnapshot(snapshot =>{
  setMessages(snapshot.docs.map(doc=>({id: doc.id, message: doc.data()})))  
  });
}, [] );


useEffect(() => {
  setUsername(prompt('please enter your name'));
},[]);


  const sendMessage = (event) =>{ 
    event.preventDefault(); 
    db.collection("messages").add({
      message:input,
      username: username,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

  setInput('');
  }
  console.log(input);
  console.log(messages)

  return (
    <div className="App">
      <img src="/images/facebook.png" alt="messenger logo" className="logo"/>
  <h1>facebook-messenger</h1>
  <h2>welcome  {username}</h2>


<form className="app__form">
<FormControl className="app__formControl">
  <Input className="app__input" placeholder="Enter a message" value ={input} onChange={event => setInput(event.target.value)} />
<IconButton className="app__iconButton" disabled={!input} variant="contained" type="submit" onClick={sendMessage}>
<SendIcon/>
</IconButton>
</FormControl>

</form>

  {
  messages.map(({id, message}) => (
    <Message key={id} username={username} message={message}/>
  ))
  }
    </div>
  );
}

export default App;
