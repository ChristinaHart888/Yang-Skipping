import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage'

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyAbtVMyFiyJopXhKHR3suqqLqflV4vw9hw",
  authDomain: "yang-skip.firebaseapp.com",
  projectId: "yang-skip",
  storageBucket: "yang-skip.appspot.com",
  messagingSenderId: "625576926763",
  appId: "1:625576926763:web:447c3699f233d7c65d546e",
  measurementId: "G-MYCPSFL27L"
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div>
      <Header />
      <section>
        <div className="App">
          <div className="main">
            { user ? <Main/> : <Login/>}
          </div>
        </div>
      </section>
    </div>
    
    
  );
}

function Main(){

  const countcoll = firestore.collection("numberofskips");

  const [numOfSkips, setNumOfSkip] = useState();
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState({imgUrl: ''});

  const name = auth.currentUser.displayName;
  const email = auth.currentUser.email;

  const uploadRecord = async(e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;

    handleFirebaseUpload()
    .then(() => {
      countcoll.add({
        count: numOfSkips,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        userID: uid
      })
    })
    
  }

  const uploadImageHandler = (e) => {
    const image = e.target.files[0];
    setImageAsFile(image)
  }

  const handleFirebaseUpload = async() => {
    if(imageAsFile === ''){
      console.log('No File');
    }else{
      const uploadTask = storage.ref(`/images/${email}/${imageAsFile.name}`).put(imageAsFile);
    }
  }

  useEffect(() => {
    console.log(imageAsFile)
  }, [imageAsFile])

  return(
    <div style={{justifyContent: 'center', alignContent: 'center', backgroundColor: "#eee", width: "60%", margin:"1em auto", padding: "1em"}}>
      <h1>Hello, {name}</h1>
      <form onSubmit={uploadRecord}>
        <label>How many times did you skip today?</label><br></br>
        <input type="number" value={numOfSkips} onChange={e => setNumOfSkip(e.target.value)}></input><br></br>
        <label>Please take a picture of your counter as proof.</label><br></br>
        <input type="file" onChange={uploadImageHandler}></input><br></br>
        <button type='submit' style={{padding: "0.75em 0.5em", fontWeight: "bold", margin: "1em"}}>Submit</button>
      </form>
    </div>
  )
}

function Header(){
  const [user] = useAuthState(auth);

  return(
    <div className="header" style={{display: 'flex', justifyContent: 'space-between', backgroundColor: '#779'}}>
      <h2 style={{margin: '0.5em 1em'}}><strong>Yang Skipping</strong></h2>
      <div className="user" style={{margin: '0.5em 1em', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
        {user ? <SignOut/> : <Login/>}
      </div>
      
    </div>
  )
}

function SignOut(){
  return(
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Login(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign In With Google</button>
  )
}

export default App;
