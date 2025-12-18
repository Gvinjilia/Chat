import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

import openSideBar from '../images/sidebar.png';
import closeSideBar from '../images/sidebar (1).png';

import background from '../images/MessangerBgimage.png';
import background3 from '../images/MessangerBgimage3.png';
import background4 from '../images/MessangerBgimage4.png';

const Chat = () => {
    const { messages, sendMessage, createChat, currChat, search, getChats, chats, joinChat } = useContext(ChatContext);
    const { user, logout } = useContext(AuthContext);
    const [mainBackground, setMainBackground] = useState(background);
    const [chatTitle, setChatTitle] = useState('');
    const [sideBar, setSideBar] = useState(false);
    const [createChatForm, setCreateChatForm] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
      getChats();
    }, []);

    useEffect(() => {
      if(searchUser.length >= 2){
        search(searchUser).then(setSearchResults); // user input ---> data = Nino GvinjiliA, setSeachResults(data = 'Nino Gvinjilia');
      } else {
        setSearchResults([]);
      };
    }, [searchUser]);

    const addMember = (user) => {
      if(!selectedUsers.find((u) => u._id === user._id)){
        setSelectedUsers([...selectedUsers, user]);
      };

      setSearchUser('');
      setSearchResults([]);
    };

    const removeMember = (userId) => {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== userId));
    };
    
    const handleCreateChat = (e) => {
      e.preventDefault();

      const chatData = {
        title: chatTitle,
        members: selectedUsers.map((u) => u._id)
      };

      createChat(chatData);

      setSearchUser('');
      setSearchResults([]);
      setSelectedUsers([]);
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      const messageData = {
        chatId: currChat,
        message: e.target.msg.value
      };

      e.target.reset();

      sendMessage(messageData);
    };

    useEffect(() => {
      const bg = [
        {
          image: background,
          formBgColor: '#B4C8D3',
          inputBgColor: '#92B5C2',
          textBgColor: '#C8102E'
        },
        {
          image: background3,
          formBgColor: '#EEF3F6',
          inputBgColor: '#C1CDD4',
          textBgColor: '#22262C'
        },
        {
          image: background4,
          formBgColor: '#94A180',
          inputBgColor: '#7D876C',
          textBgColor: '#3D4E22'
        }
      ];

      const randomIndex = Math.floor(Math.random() * bg.length);

      setMainBackground(bg[randomIndex]);
    }, []);

    return (
        <>
          <main className="h-screen flex flex-col justify-between">
              <div className="flex justify-between w-full items-center pt-7 pr-3 pl-3 pb-3">
                <div className="flex justify-between">
                  <p onClick={logout}>Logout</p>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill={mainBackground.textBgColor}><path d="M21 16.5c-.5 1.5-2.3 2.2-3.6 2.1-1.8-.2-3.7-1.1-5.2-2.1-2.1-1.5-4.1-3.8-5.3-6.3-.8-1.8-1-3.9.2-5.5.5-.6 1-.9 1.7-.9 1 0 1.2.6 1.5 1.5.3.7.6 1.4.8 2.1.4 1.3-.9 1.4-1.1 2.5-.1.7.7 1.6 1.1 2.1.7.9 1.6 1.8 2.6 2.4.6.4 1.5 1 2.1.6 1-.5.9-2.2 2.3-1.7.7.3 1.4.7 2.1 1.1 1.1.6 1 1.2.6 2.4z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill={mainBackground.textBgColor}><path d="M21.05 7.3a2 2 0 0 0-1.94-.09l-2.56 1.28a1 1 0 0 0-.55.89v5.24a1 1 0 0 0 .55.89l2.56 1.28A2 2 0 0 0 20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-.95-1.7Z"></path><rect x="2" y="5" width="16" height="14" rx="2" fill={mainBackground.textBgColor}></rect></svg>
                </div>
              </div>
              <div className="lg:flex lg:flex-row md:flex md:flex-row sm:flex sm:flex-row flex flex-col">
                <div className="flex flex-col pl-2 pr-2 mb-2">
                  {
                    sideBar ? (
                      <img src={closeSideBar} onClick={() => setSideBar(!sideBar)} className="w-7 h-7 mb-2" />
                    ) : (
                      <img src={openSideBar} onClick={() => setSideBar(!sideBar)} className="w-7 h-7" />
                    )
                  }

                  <div className={`${sideBar ? 'block' : 'hidden'}`}>
                    <button onClick={() => setCreateChatForm((prev) => !prev)} className="border p-1 lg:w-83 md:w-83 sm:w-83 w-full mb-2">{createChatForm ? 'Cancel' : 'Create Chat'}</button>
                    {createChatForm && (
                      <form onSubmit={handleCreateChat} className="flex flex-col gap-2 mb-2">
                        <input type="text" name="title" placeholder="Enter Chat Title" className="border p-1 pl-2 outline-none" onChange={(e) => setChatTitle(e.target.value)} required />
                        <input type="text" name="member" placeholder="Enter member names" className="border p-1 pl-2 outline-none" onChange={(e) => setSearchUser(e.target.value)} required />
                        {searchResults.length > 0 && (
                          <div>
                            {searchResults.map((u, index) => (
                              <div key={index} onClick={() => addMember(u)}>
                                {u.fullname}
                              </div>
                            ))}
                          </div>
                        )}
                        <button className="border p-1">Add Chat</button>
                      </form>
                    )}

                    {
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedUsers.map((u, index) => (
                          <div key={index} style={{backgroundColor: mainBackground.textBgColor, color: 'var(--message-bg-color2, #F0F0F0)'}} className="flex justify-between w-37 p-1">
                            <div>
                              {u.fullname}
                            </div>
                            <button onClick={() => removeMember(u._id)}>X</button>
                          </div>
                        ))}
                      </div>
                    }
                    <div className="mb-2">
                      <p>CHATS</p>
                      {
                        chats.length > 0 ? (
                          chats.map((chat, index) => (
                            <div key={index} onClick={() => joinChat(chat._id)}>
                              <p>{chat.title}</p>
                            </div>
                          ))
                        ) : (
                          <p>No one added you to the chat yet</p>
                        )
                      }
                    </div>
                  </div>
                </div>
                <div className="flex h-screen max-h-screen w-full overflow-hidden">
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col overflow-y-auto gap-2 lg:pl-20 lg:pr-20 lg:pt-20 md:p-10 sm:p-5 p-5 pb-5 flex-1" style={{ backgroundImage: `url(${mainBackground.image})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: '50% 20%' }}>
                      {messages.map((message, index) => (
                        <div key={index} className={user.fullname === message.sender.fullname ? 'flex flex-col items-end' : 'flex flex-col items-start'}>
                          <p>{user.fullname === message.sender.fullname ? 'You' : message.sender.fullname}</p>

                          <div style={{backgroundColor: user.fullname === message.sender.fullname ? mainBackground.textBgColor : 'var(--message-bg-color2, #F0F0F0)'}} className={`${user.fullname === message.sender.fullname ? 'text-white' : 'text-black'} w-auto rounded-xl pl-3 pr-3 pt-1 pb-1`}>
                            <p>{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex justify-between ${sideBar ? 'lg:ml-[347.67px] md:ml-[347.67px] sm:ml-[347.67px]' : 'lg:ml-10.75 md:ml-10.75 sm:ml-10.75'} items-center p-5.75`} style={{backgroundColor: mainBackground.formBgColor}}>
                <div className="flex justify-center items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill={mainBackground.textBgColor}><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 9a1 1 0 0 0 1-1v-2h-2v2a1 1 0 0 0 1 1z"></path></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" fill={mainBackground.textBgColor}><path d="M450.29,112H142c-34,0-62,27.51-62,61.33V418.67C80,452.49,108,480,142,480H450c34,0,62-26.18,62-60V173.33C512,139.51,484.32,112,450.29,112Zm-77.15,61.34a46,46,0,1,1-46.28,46A46.19,46.19,0,0,1,373.14,173.33Zm-231.55,276c-17,0-29.86-13.75-29.86-30.66V353.85l90.46-80.79a46.54,46.54,0,0,1,63.44,1.83L328.27,337l-113,112.33ZM480,418.67a30.67,30.67,0,0,1-30.71,30.66H259L376.08,333a46.24,46.24,0,0,1,59.44-.16L480,370.59Z"/><path d="M384,32H64A64,64,0,0,0,0,96V352a64.11,64.11,0,0,0,48,62V152a72,72,0,0,1,72-72H446A64.11,64.11,0,0,0,384,32Z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill={mainBackground.textBgColor}><path opacity="0.5" d="M20.0714 13.0097C20.6165 13 21.2494 13 22 13V12C22 7.28596 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28596 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28596 2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28596 22 12 22H13C13 21.2494 13 20.6165 13.0097 20.0714C13.0292 18.9774 13.0878 18.2372 13.2641 17.6093L13.2667 17.5999C13.2799 17.5534 13.2937 17.5074 13.3082 17.462L13.3146 17.442C13.5336 16.7682 13.859 16.1445 14.2715 15.5903C14.3083 15.5409 14.3458 15.492 14.384 15.4437C15.1608 14.4605 16.2188 13.7121 17.442 13.3146C18.1067 13.0987 18.8788 13.031 20.0714 13.0097Z"/><path d="M14.8793 21.8034L14.8748 21.8044L14.8138 21.8171L14.8119 21.8175C14.2266 21.9371 13.6206 21.9999 13 21.9999H12L12.344 21.6563C12.7648 21.236 12.9991 20.6661 13.0097 20.0713C13.031 18.8787 13.0987 18.1066 13.3146 17.4419C13.9505 15.4848 15.4849 13.9504 17.442 13.3145C18.1067 13.0986 18.8788 13.0309 20.0714 13.0096C20.6661 12.999 21.236 12.7649 21.6566 12.3443L22 12.001V12.9999C22 13.6619 21.9285 14.3072 21.7929 14.9285C21.0456 18.351 18.3511 21.0456 14.9286 21.7928L14.8793 21.8034Z"/><path d="M15 12C15.5523 12 16 11.3284 16 10.5C16 9.67157 15.5523 9 15 9C14.4477 9 14 9.67157 14 10.5C14 11.3284 14.4477 12 15 12Z"/><path d="M9 12C9.55228 12 10 11.3284 10 10.5C10 9.67157 9.55228 9 9 9C8.44772 9 8 9.67157 8 10.5C8 11.3284 8.44772 12 9 12Z"/><path d="M13.3146 17.442C13.5336 16.7682 13.859 16.1445 14.2715 15.5903C13.6028 16.0111 12.8269 16.25 12 16.25C11.0541 16.25 10.175 15.9374 9.44666 15.3975C9.11389 15.1509 8.64418 15.2207 8.39752 15.5534C8.15086 15.8862 8.22067 16.3559 8.55343 16.6026C9.52585 17.3234 10.7151 17.75 12 17.75C12.4338 17.75 12.8567 17.7014 13.2641 17.6093L13.2667 17.5999C13.2799 17.5534 13.2937 17.5074 13.3082 17.462L13.3146 17.442Z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill={mainBackground.textBgColor}><path d="M18.75,3.50054297 C20.5449254,3.50054297 22,4.95561754 22,6.75054297 L22,17.2531195 C22,19.048045 20.5449254,20.5031195 18.75,20.5031195 L5.25,20.5031195 C3.45507456,20.5031195 2,19.048045 2,17.2531195 L2,6.75054297 C2,4.95561754 3.45507456,3.50054297 5.25,3.50054297 L18.75,3.50054297 Z M8.01459972,8.87193666 C6.38839145,8.87193666 5.26103525,10.2816525 5.26103525,11.9943017 C5.26103525,13.707564 6.38857781,15.1202789 8.01459972,15.1202789 C8.90237918,15.1202789 9.71768065,14.6931811 10.1262731,13.9063503 L10.2024697,13.7442077 L10.226,13.674543 L10.2440163,13.5999276 L10.2516169,13.5169334 L10.2518215,11.9961937 L10.2450448,11.9038358 C10.2053646,11.6359388 9.99569349,11.4234501 9.72919932,11.3795378 L9.62682145,11.3711937 L8.62521827,11.3711937 L8.53286035,11.3779703 C8.26496328,11.4176506 8.05247466,11.6273217 8.00856234,11.8938159 L8.00021827,11.9961937 L8.00699487,12.0885517 C8.0466751,12.3564487 8.25634623,12.5689373 8.5228404,12.6128497 L8.62521827,12.6211937 L9.00103525,12.6209367 L9.00103525,13.3549367 L8.99484486,13.3695045 C8.80607251,13.6904125 8.44322427,13.8702789 8.01459972,13.8702789 C7.14873038,13.8702789 6.51103525,13.0713011 6.51103525,11.9943017 C6.51103525,10.9182985 7.14788947,10.1219367 8.01459972,10.1219367 C8.43601415,10.1219367 8.67582824,10.1681491 8.97565738,10.3121334 C9.28681641,10.4615586 9.6601937,10.3304474 9.80961888,10.0192884 C9.95904407,9.70812933 9.82793289,9.33475204 9.51677386,9.18532686 C9.03352891,8.95326234 8.61149825,8.87193666 8.01459972,8.87193666 Z M12.6289445,8.99393497 C12.3151463,8.99393497 12.0553614,9.22519285 12.0107211,9.52657705 L12.0039445,9.61893497 L12.0039445,14.381065 L12.0107211,14.4734229 C12.0553614,14.7748072 12.3151463,15.006065 12.6289445,15.006065 C12.9427427,15.006065 13.2025276,14.7748072 13.2471679,14.4734229 L13.2539445,14.381065 L13.2539445,9.61893497 L13.2471679,9.52657705 C13.2025276,9.22519285 12.9427427,8.99393497 12.6289445,8.99393497 Z M17.6221579,9.00083497 L15.6247564,8.99393111 C15.3109601,8.99285493 15.0503782,9.22321481 15.0046948,9.52444312 L14.9975984,9.61677709 L14.9975984,14.3649711 L15.0043751,14.4573291 C15.0440553,14.7252261 15.2537265,14.9377148 15.5202206,14.9816271 L15.6225985,14.9899711 L15.7149564,14.9831945 C15.9828535,14.9435143 16.1953421,14.7338432 16.2392544,14.467349 L16.2475985,14.3649711 L16.2470353,13.2499367 L17.37,13.2504012 L17.4623579,13.2436246 C17.730255,13.2039444 17.9427436,12.9942732 17.9866559,12.7277791 L17.995,12.6254012 L17.9882234,12.5330433 C17.9485432,12.2651462 17.738872,12.0526576 17.4723779,12.0087453 L17.37,12.0004012 L16.2470353,11.9999367 L16.2470353,10.2449367 L17.6178421,10.2508313 L17.7102229,10.2443727 C18.0117595,10.2007704 18.2439132,9.94178541 18.2450039,9.62798912 C18.24608,9.31419284 18.0157202,9.05361096 17.7144919,9.00793041 L17.6221579,9.00083497 L15.6247564,8.99393111 L17.6221579,9.00083497 Z"/></svg>
                </div>
                <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full px-4">      
                  <input type="text" name="msg" placeholder="Send Message" className='rounded-full w-full pl-4 p-2 outline-none' style={{backgroundColor: mainBackground.inputBgColor}} />
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill={mainBackground.textBgColor}><path d="M44.9,23.2l-38-18L6,5A2,2,0,0,0,4,7L9.3,23H24a2.1,2.1,0,0,1,2,2,2,2,0,0,1-2,2H9.3L4,43a2,2,0,0,0,2,2l.9-.2,38-18A2,2,0,0,0,44.9,23.2Z"/></svg>
                </form>
              </div>
          </main>
        </>
    )
};

export default Chat;