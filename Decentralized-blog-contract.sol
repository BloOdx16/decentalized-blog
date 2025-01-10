// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedBlog {
    struct Blog {
        uint id;
        address author;
        string content;
        uint likes;
    }

    mapping(uint => Blog) public blogs;
    uint public blogCount;

    event BlogPosted(uint id, address author, string content);
    event BlogLiked(uint id, uint likes);

    function postBlog(string memory _content) public {
        blogCount++;
        blogs[blogCount] = Blog(blogCount, msg.sender, _content, 0);
        emit BlogPosted(blogCount, msg.sender, _content);
    }

    function likeBlog(uint _id) public {
        require(_id > 0 && _id <= blogCount, "Invalid blog ID");
        blogs[_id].likes++;
        emit BlogLiked(_id, blogs[_id].likes);
    }

    function getBlog(uint _id) public view returns (uint, address, string memory, uint) {
        require(_id > 0 && _id <= blogCount, "Invalid blog ID");
        Blog memory blog = blogs[_id];
        return (blog.id, blog.author, blog.content, blog.likes);
    }
}
