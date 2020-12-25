window.addEventListener('load', () => {
    stories.start();
    feed.start();
})

stories = {
    
    stories: 0,

    start() {

        stories.stories = document.getElementById("stories")
        stories.refreshStories()
    },

    refreshStories() {

        stories.addStorie("alex", "foto3.jpg")
        stories.addStorie("bruno", "foto3.jpg")
        stories.addStorie("toninho", "foto3.jpg")
        
        for(let i=0; i<10; i++)
            stories.addStorie("abcdeabcdeabcdeabcde", "foto4.jpg")

    },

    addStorie(name, imagePath) {

        const div = document.createElement('div')
        div.className = 'storie'
        div.innerHTML = stories.getDiv(name, imagePath)
        stories.stories.appendChild(div)
    },

    getDiv(name, imagePath) {
        
        let html = ''
        html += '<img class="storie_image" src="' + imagePath + '" alt="storie">'
        html += '<div class="storie_name">' + name + '</div>'

        return html
    }
}

feed = {

    feed: 0,

    start() {
        feed.feed = document.getElementById("feed")
        //feed.addPost()
    },

    addPost() {

        const div = document.createElement('div')
        div.className = 'post'
        div.innerHTML = feed.getDiv()
        feed.feed.appendChild(div)
    },

    getDiv() {
        return ""
    }
}