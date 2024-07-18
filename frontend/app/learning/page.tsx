// app/learning/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
interface User {
    id: number;
    username: string;
    password: string;
    // Add other properties as per your user object schema
  }
export default function Learning({ params }: { params: { user: string } }): JSX.Element {
    const [users, setUsers] = useState<User[]>([]);
    const [userInput,setUserInput] = useState('');
    const [passInput,setPassInput] = useState('');
  
  // on Load set the text to the users
    useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users',{
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json()
      console.log(data)
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async () => {
    // This works but is barebones. No safeties for duplicate entries and other things. 
    try {
      const response = await fetch('/api/newUser', {
        method: 'POST',
        body: JSON.stringify({ username: userInput, password: passInput }),
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      else{
        console.log(await response.json())
        fetchUsers();
      }
      
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <main className="text-center flex-col w-full min-h-screen items-center bg-[url('./public/grassback.jpg')] bg-cover bg-no-repeat bg-center text-black text-7xl">
      {users.map((user) => (
        <div key={user.id}>
          {user.id} - {user.username} - {user.password}
        </div>
      ))}
      <input onChange={(e)=>setUserInput(e.target.value)}></input>
      <input onChange={(e)=>setPassInput(e.target.value)}></input>
      <button onClick={addUser}>Add user</button>
    </main>
  );
}
