import { timer } from "./src/data/db.js";


//开局初始化
    const ACTIVE = 'active'
    const tabs = document.querySelectorAll('[data-tab-target]')
    const tabContent = document.querySelectorAll('[data-tab-content]')

    const timeShow = document.querySelectorAll('.time')
    const startBtn = document.querySelectorAll('.start')

    const audios = []

    timer.forEach(element => {
    const audio = new Audio(`./src/sounds/${element.sound}`)
    audio.loop = true
    audios.push(audio)
    })

    //切换键
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
        tabContent.forEach(content => {
            content.classList.remove(ACTIVE)
        })
        tabs.forEach(tab => {
            tab.classList.remove(ACTIVE)
        })
        tab.classList.toggle(ACTIVE)
        const target = document.querySelector(tab.dataset.tabTarget)
        target.classList.toggle(ACTIVE)
        })
    })

    //展示时间
    timeShow.forEach((element, index) => {
        const totalTime = calculateTotalSeconds(timer[index])
        elementTime(element, totalTime)
    })
    
    function calculateTotalSeconds(timer) {
        const { hours, minutes, seconds } = timer;
        return 3600 * hours + 60 * minutes + seconds;
    }
    
    function elementTime(element, time) {
        const { hours, minutes, seconds } = calculateTime(time)
        element.textContent = `${minutes}:${seconds}`
        if (hours) {
        element.textContent = `${hours}:` + element.textContent
        }
    }

    //计算时间
    function calculateTime(time) {
        const hours = parseInt(time / 3600)
        const minutes = addZero(parseInt(parseInt(time % 3600) / 60))
        const seconds = addZero(time - hours * 3600 - minutes * 60)
        return { hours, minutes, seconds }
    }
    
    function addZero(time) {
        return (+time < 10 && +time >= 0) ? `0${time}` : time
    }

    //start按键
    startBtn.forEach((element, index) => {
        element.textContent = "Start"
        let handle
        element.addEventListener('click', () => {
        audios[index].pause()
        audios[index].currentTime = 0;
        element.classList.toggle(ACTIVE)
        const isActive = element.classList.contains(ACTIVE)
        element.textContent = isActive ? "Stop" : "Start"
        if (isActive) {
            handle = start(index, timeShow[index],
            calculateTotalSeconds(timer[index]))
        } else {
            clearInterval(handle)
            const totalTime = calculateTotalSeconds(timer[index])
            elementTime(timeShow[index], totalTime)
        }
        })
    })
    
    function start(index, element, time) {
        let handle = null
        if (time) {
        handle = setInterval(() => {
            elementTime(element, --time)
            if (time <= 0) {
            clearInterval(handle)
            startBtn[index].textContent = "Reset"
            audios[index].play()
            }
        }, 1000)
        } else {
        startBtn[index].textContent = "Reset"
        audios[index].play()
        }
        return handle
    }

