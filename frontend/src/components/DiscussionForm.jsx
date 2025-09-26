import React, { useState } from "react";


const DiscussionForm = () => {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
const [posts, setPosts] = useState([]);


const handleSubmit = (e) => {
e.preventDefault();
if (!name || !message) return alert("Please fill name and message");
const newPost = { id: Date.now(), name, email, message };
setPosts([newPost, ...posts]);
setName("");
setEmail("");
setMessage("");
};


return (
<section className="mt-8">
<h3 className="text-lg font-semibold">Discussion</h3>
<form onSubmit={handleSubmit} className="mt-3 space-y-3 max-w-xl">
<div className="flex gap-3">
<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="flex-1 p-2 border rounded" />
<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="flex-1 p-2 border rounded" />
</div>
<textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write your message..." className="w-full p-2 border rounded" />
<div>
<button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md">Post</button>
</div>
</form>


<div className="mt-6 space-y-4">
{posts.length === 0 && <div className="text-gray-500">No discussions yet. Start one!</div>}
{posts.map((p) => (
<div key={p.id} className="p-3 border rounded bg-gray-50">
<div className="font-semibold">{p.name}</div>
<div className="text-sm text-gray-600">{p.email}</div>
<div className="mt-2 text-gray-800">{p.message}</div>
</div>
))}
</div>
</section>
);
};


export default DiscussionForm;