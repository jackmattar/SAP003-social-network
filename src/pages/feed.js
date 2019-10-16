import Button from '../components/button.js';

const logout = () => {
  app.auth.signOut().catch((error) => {
    // console.log(error);
  });
};

const deletePost = (id) => {
  app.db.collection('posts').doc(id).delete().then(() => {
    document.getElementById(id).parentElement.parentElement.remove();
  });
};

const checkUser = (docUid) => {
  const user = app.auth.currentUser.uid;
  if (user !== docUid) {
    document.getElementsByName(docUid).forEach((bt) => {
      bt.remove();
    });
  }
};

const makePostEditable = (post) => { 
  post.style.border = '1px solid #000000';
  post.style.padding = '20px'
  post.contentEditable = true
  };
  
const saveEditPost = (post) => {
  // post.style.border = '10px solid #000000';
  // post.style.padding = '0px';
  post.contentEditable = false;

  console.log(post)
  // const db = firebase.firestore();
  // db.collection('posts').doc(id).update({text: post.value}) 
}

const postTemplate = (doc) => {
  document.querySelector('.posts').innerHTML
    += `
    <div class='posted container-post' data-id=${doc.id}> 
      <p class='posted posted-name'> ${doc.data().name}
        <button type='button' class='delete-btn' id=${doc.id} name=${doc.data().user}>X</button>
      </p>
      <p class='posted text'> ${doc.data().text} |</p>
      <button type='button' class='edit-btn' id=${doc.id}>Editar</button>
      <button type='button' class='save-btn' id=${doc.id}>Salvar</button>
      <p>${doc.data().date}</p>
    </div>`;

  checkUser(doc.data().user);
  document.querySelectorAll('.delete-btn').forEach(cls => cls.addEventListener('click', e => deletePost(e.target.id)));

  const xuxu= document.querySelector('.text')
  document.querySelectorAll('.edit-btn').forEach
  (cls => cls.addEventListener('click', e => makePostEditable(xuxu)))

  document.querySelectorAll('.save-btn').forEach
  (cls => cls.addEventListener('click', saveEditPost(xuxu)))

};

const showPosts = () => {
  app.db.collection('posts').orderBy('timestamp', 'desc').get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        postTemplate(doc);
      });
    });
};

const newPost = () => {
  const postsSpace = document.querySelector('.posts');
  const textArea = document.querySelector('.add-post');
  const post = {
    name: app.auth.currentUser.displayName,
    user: app.auth.currentUser.uid,
    text: textArea.value,
    timestamp: new Date().getTime(),
    date: new Date().toLocaleString('pt-BR').slice(0, 16),
  };
  app.db.collection('posts').add(post).then(() => {
    postsSpace.innerHTML = '';
    app.showPosts();
    textArea.value = '';
  });
};

function Feed() {
  const template = `
    <section class="container">
      <section class="container">
      <textarea class="add-post" placeholder="O que você está ouvindo?"></textarea>
      ${Button({
    type: 'button', title: 'Postar', class: 'primary-button', onClick: newPost,
  })}
        <div class="posts">  </div>
      </section>
      ${Button({
    type: 'button', title: 'Logout', class: 'primary-button', onClick: logout,
  })}
    </section>
  `;

  return template;
}

window.onhashchange = showPosts;
window.onload = showPosts;

window.app = {
  showPosts,
  db: firebase.firestore(),
  auth: firebase.auth(),
};

export default Feed;
