import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address
const abi = [ /* ABI from your compiled contract */ ];

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          await window.ethereum.enable();
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
          setContract(contractInstance);

          const blogCount = await contractInstance.methods.blogCount().call();
          const blogs = [];
          for (let i = 1; i <= blogCount; i++) {
            const blog = await contractInstance.methods.getBlog(i).call();
            blogs.push(blog);
          }
          setBlogs(blogs);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    init();
  }, []);

  const postBlog = async () => {
    if (contract && content) {
      await contract.methods.postBlog(content).send({ from: account });
      setContent('');
      window.location.reload();
    }
  };

  const likeBlog = async (id) => {
    if (contract) {
      await contract.methods.likeBlog(id).send({ from: account });
      window.location.reload();
    }
  };

  return (
    <div className="App">
      <h1>Decentralized Blog</h1>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog here..."
        />
        <button onClick={postBlog}>Post Blog</button>
      </div>
      <div>
        {blogs.map((blog) => (
          <div key={blog.id} className="blog">
            <h2>Blog #{blog.id}</h2>
            <p>{blog.content}</p>
            <p>Author: {blog.author}</p>
            <p>Likes: {blog.likes}</p>
            <button onClick={() => likeBlog(blog.id)}>Like</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
