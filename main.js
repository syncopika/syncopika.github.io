import { Home } from './pages/Home.js';
import { About } from './pages/About.js';
import { Music } from './pages/Music.js';
import { Software } from './pages/Software.js';
import { Novelties } from './pages/Novelties.js';
import { Blog } from './pages/Blog.js';
import { BlogEntry } from './pages/BlogEntry.js';
import { NotFound } from './pages/NotFound.js';

const Contact = {
    mounted: function(){
        let contact = this.$refs["emailButton"];
        contact.addEventListener('click', function(){
            // this function comes from roulette.js
            roulette("nhung93 at outlook.com".split(""), $("#email").html().split(""), $("#email").html(), "email" );
        });
    },
    template:
        `<div id='contactContent'>
            <br>
            <p>you can contact me at my email below! thanks!</p>
            <h2 id='email'>abcdef1 lm opqr,stuxzy</h2>
            <button ref="emailButton" id='getEmail' class='btn-primary'>decode</button>
        </div>`
}

const router = new VueRouter({
    history: true,
    routes: [
        {path: '/', component: Home},
        {path: '/about', component: About},
        {path: '/music', component: Music},
        {path: '/software', component: Software},
        {path: '/novelties', component: Novelties},
        {path: '/blog', component: Blog},
        {path: '/blog/:entryTitle', name: 'blog', component: BlogEntry, props: true},
        {path: '/contact', component: Contact},
        {path: '*', component: NotFound}
    ]
});

const app = new Vue({router}).$mount('#app');
