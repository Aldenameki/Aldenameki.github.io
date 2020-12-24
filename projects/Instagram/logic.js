window.addEventListener('load', () => {
    stories.start();
})

stories = {
    
    stories: 0,

    start() {
        stories.stories = document.getElementById("stories")
        stories.refreshStories()
    },

    refreshStories() {
        stories.addStorie("alex", "foto1.jpg")
        stories.addStorie("bruno", "foto1.jpg")
        stories.addStorie("abcdeabcdeabcdeabcde", "foto1.jpg")
        
        for(let i=0; i<10; i++)
            stories.addStorie("abcdeabcdeabcdeabcde", "foto1.jpg")

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
