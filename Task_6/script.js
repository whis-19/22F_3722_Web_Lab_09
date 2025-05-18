async function addBlog() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    await fetch('http://localhost:3000/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, content })
    });
    loadBlogs();
}

async function loadBlogs() {
    const response = await fetch('http://localhost:3000/api/blogs');
    const blogs = await response.json();
    const container = document.getElementById('blogContainer');
    container.innerHTML = '';

    blogs.forEach(blog => {
        const blogDiv = document.createElement('div');
        blogDiv.classList.add('blog-card');
        blogDiv.innerHTML = `
            <div class='blog-title'>${blog.title}</div>
            <div><strong>Author:</strong> ${blog.author}</div>
            <p><span class='read-more' onclick='viewBlog(${blog.id})'>Read More</span></p>
        `;
        container.appendChild(blogDiv);
    });
}

async function viewBlog(id) {
    const response = await fetch(`http://localhost:3000/api/blogs/${id}`);
    const blog = await response.json();
    alert(`Title: ${blog.title}\nAuthor: ${blog.author}\nContent: ${blog.content}`);
}

loadBlogs();