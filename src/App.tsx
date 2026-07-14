import ChatList from "./component/ChatList";
import RightContent from "./component/RightContent";
// import Chat from "./component/Chat";
import "./App.css";
// import useState from 'react'

function App() {
  return (
    <div className="grid md:grid-cols-3">
      <ChatList></ChatList>
      <RightContent></RightContent>
    </div>
  );
}

export default App;
