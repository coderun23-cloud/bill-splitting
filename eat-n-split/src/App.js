import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectFriend, setSelectFriend] = useState(null);
  function handleShowAddFriend() {
    setShowAddFriend((show) => !showAddFriend);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    // setSelectFriend(friend);
    setSelectFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectFriend={selectFriend}
          onSelect={handleSelection}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add a Friend"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill selectFriend={selectFriend} onSplit={handleSplitBill} />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelect, selectFriend }) {
  return (
    <ul>
      {friends.map((friends) => (
        <Friend
          friend={friends}
          key={friends.id}
          onSelect={onSelect}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelect, selectFriend }) {
  const isSelected = selectFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name}
          {""}
          {Math.abs(friend.balance)}
        </p>
      )}
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          Your friend owes you
          {""}
          {Math.abs(friend.balance)}
        </p>
      )}
      <h3>{friend.name}</h3>
      {friend.balance === 0 && (
        <p className="">
          You and your friend are even {""}
          {Math.abs(friend.balance)}
        </p>
      )}
      <button className="button" onClick={() => onSelect(friend)}>
        {isSelected ? "close" : "Select"}
      </button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🥷Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button className="button">Add</button>
    </form>
  );
}
function FormSplitBill({ selectFriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoispaying, setWhoispaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplit(whoispaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectFriend.name} </h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>💰Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>🥷{selectFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoispaying}
        onChange={(e) => setWhoispaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectFriend.name}</option>
      </select>
      <button className="button">Split Bill</button>
    </form>
  );
}
