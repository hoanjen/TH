



const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let playList = $('.playlist');
let dashboard = $('.dashboard');
const player = $('.player');
const audio = $('#audio');
const cd = $('.cd');
const progress = $('#progress');
const thumb = $('.cd-thumb');
const btnPlay = $('.btn-toggle-play');
const btnRepeat = $('.btn-repeat');
const btnPrev = $('.btn-prev');
const btnNext = $('.btn-next');
const btnRandom = $('.btn-random');



const app = {
    songs:[
        { 
            name: 'Tiếu Nạp',
            singer: '笑纳',
            path: './mp3/1.mp3',
            image: './img/1.png'
        },
        {
            name: 'CÒN LẠI MỘT MÌNH',
            singer: 'JACK VIET NAM',
            path: './mp3/2.mp3',
            image: './img/2.png'
        },
        {
            name: 'Đừng Lo Nhé Có Anh Đây',
            singer: 'Thiên Tú x Freak D',
            path: './mp3/3.mp3',
            image: './img/3.png'
        },
        {
            name: 'Bay Giữa Ngân Hà',
            singer: 'Nam Cường',
            path: './mp3/4.mp3',
            image: './img/4.png'
        },
        {
            name: 'Đồi Hoa Mặt Trời',
            singer: 'Hoàng Yến',
            path: './mp3/5.mp3',
            image: '/img/5.png'
        }
        ,
        {
            name: 'Giấc mơ về hoa anh đào',
            singer: 'Wotamin',
            path: './mp3/6.mp3',
            image: '/img/6.png'
        },
        {
            name: 'Có Chàng Trai Viết Lên Cây',
            singer: 'Hoàng Yến',
            path: './mp3/7.mp3',
            image: '/img/7.png'
        },
        {
            name: 'Gió Nổi Rồi',
            singer: 'Châu Thâm',
            path: './mp3/8.mp3',
            image: '/img/8.png'
        }
        ,
        {
            name: 'Tôi ghét cuộc sống của tôi',
            singer: 'Kanzaki Iori',
            path: './mp3/9.mp3',
            image: '/img/9.png'
        }
    ],
    currentIndex: 0
    ,
    isRepeat: false,
    isPlaying: false
    ,
    definePropreties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    render: function(){
        let htmls = this.songs.map(function(current, index){
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index =${index}>
            <div class="thumb" style="background-image: url(${current.image})">
            </div>
            <div class="body">
            <h3 class="title">${current.name}</h3>
            <p class="author">${current.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
            `
        })
        htmls = htmls.join('');
        playList.innerHTML = htmls;
    },
    renderHeader: function(){
        $('.dashboard h2').innerText = this.currentSong.name;
        $('.cd-thumb').style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        $('.active').classList.remove('active');
        this.render();
    }
    ,
    handleSong: function(){

        const _this = this;
        this.renderHeader();
        const animateThumb = thumb.animate({ transform: 'rotate(360deg)' }, {
            duration: 5000,
            iterations: Infinity
        });
        animateThumb.pause();
        btnPlay.onclick = function(){
            if(!_this.isPlaying){
                player.classList.add('playing');
                audio.play();
                _this.isPlaying = !_this.isPlaying;
                animateThumb.play();
            }
            else{
                player.classList.remove('playing');
                audio.pause();
                _this.isPlaying = !_this.isPlaying;
                animateThumb.pause();
            }

        }
        audio.ontimeupdate = function () {
            if(this.duration){
                const progressPercent = Math.floor(this.currentTime / this.duration * 100)
                progress.value = progressPercent;
            }
        }

        progress.onchange = function () {
            audio.currentTime = progress.value * audio.duration / 100;
        }
        const tmp = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidthCD = tmp - scrollTop;
            cd.style.width = newWidthCD > 0 ? newWidthCD + 'px' : 0;
        }
        btnNext.onclick = function () {
            _this.nextMusic();
            
            
        }
        btnPrev.onclick = function () {
            _this.prevMusic();
            
        }

        btnRepeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            $('.btn-repeat').classList.toggle('btn-active',_this.isRepeat);
        }
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                _this.nextMusic();
            }
        } 

        btnRandom.onclick = function(){
            _this.randomMusic();
            _this.currentIndex = 0;
            _this.renderHeader();
            _this.render();
            if (_this.isPlaying) {
                audio.play();
            }
        }
        
        playList.onclick = function(e){
            var nodeSong = e.target.closest('.song:not(.active)');
            if(nodeSong || e.target.closest('option')){
                if(nodeSong){
                    _this.currentIndex = nodeSong.dataset.index;
                    //= nodeSong.getAttribute('data-index');
                    
                    $('.active').classList.remove('active');
                    nodeSong.classList.add('active')
                    _this.renderHeader();

                    if (_this.isPlaying) {
                        audio.play();
                    }
                }
            }
        }
    
    },
    nextMusic: function (){
        this.currentIndex++;
        if (this.currentIndex === this.songs.length) {
            this.currentIndex = 0;
        }
        this.renderHeader();
        
        if(this.isPlaying){
            audio.play();
        }
    },
    randomMusic: function () {
        var tmp = Math.round(Math.random() * this.songs.length);
        var array1 = [], array2 = [];
        do {
            for (var i = 0; i < this.songs.length; i++) {
                if (i % 2 == 0) {
                    array1.push(this.songs[i]);
                }
                else {
                    array2.push(this.songs[i]);
                }
            }
            tmp--;
            this.songs = array2.concat(array1);
            array1 = [], array2 = [];
        } while (tmp > 0);

    }
    ,
    prevMusic: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1;
        }
        this.renderHeader();
        if (this.isPlaying) {
            audio.play();
        }
    }   
    ,
    start: function () {
        this.definePropreties();
        this.render();
        this.handleSong();

    }
}
app.start();

