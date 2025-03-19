<template>

    <div class="container">
        <div class="game">
            <!-- 渲染地图 -->
            <div class="map-container">
                <!-- 游戏内容 -->
                <div class="map-content">
                    <div :class="'map-item map-item-style-' + `${item}`" :data-index="i" v-for="(item, i) in map"
                        :key="i">
                        {{ renderItem(item) }}
                    </div>
                </div>
                <!-- 失败界面 -->
                <div v-if="fail" class="map-fail">
                    <button class="restart-button" @click="snake.restart()">
                        <span>{{ '(R)' + t('game_terms.restart') }}</span>
                    </button>
                </div>
            </div>
            <div class="map-info">
                <div class="w-full flex flex-wrap gap-2 justify-center">
                    <!-- 开始/停止按钮 -->
                    <button class="keyword-button" :disabled="fail" @click="snake.start()">
                        {{ 'O(' + t('game_terms.start') + ')' }}
                    </button>
                    <button class="keyword-button" :disabled="fail" @click="snake.stop()">
                        {{ 'P(' + t('game_terms.stop') + ')' }}
                    </button>
                </div>
                <!-- 游戏信息1 -->
                <div class="w-full flex pl-3 border border-gray-400">
                    <ul>
                        <li>{{ t('GlutonousSnake.map_size') }} {{ map_width }} * {{ map_height }}</li>
                        <li>{{ t('GlutonousSnake.game_level') }} {{ snake.level }}</li>
                        <li>{{ t('GlutonousSnake.game_speed') }} {{ snake.speed }}</li>
                        <li>{{ t('GlutonousSnake.game_score') }} {{ snake.score }}</li>
                        <li>{{ t('GlutonousSnake.game_step') }} {{ snake.step }}</li>
                        <li>{{ t('GlutonousSnake.game_use_time') }} {{ snake.startTime == 0 ? 0 :
                            calDuration(snake.startTime) }}</li>
                        <li>{{ t('GlutonousSnake.next_level_score') }} {{ Math.abs(snake.nextLevel[snake.level - 1] -
                            snake.score) }}</li>
                        <li>{{ t('GlutonousSnake.history_heigh_score') }} {{ snake.score }}</li>
                    </ul>
                </div>
                <!-- 游戏信息2 -->
                <div class="w-full text-lg font-bold">{{ t('GlutonousSnake.acceleration_bar') }} </div>
                <n-progress class="w-full" type="line" status="warning" :percentage="snake.speedUpReady * 10"
                    indicator-placement="inside" />
                <div class="w-full text-lg font-bold">{{ t('GlutonousSnake.oil_generation_probability') }}</div>
                <n-progress class="w-full" type="line" status="error"
                    :percentage="snake.gasoline >= 0 ? 0 : snake.gasolineRate * 10" indicator-placement="inside" />
            </div>
        </div>
        <div class="game-info">
            <n-descriptions :title="t('game_terms.gameRule')" label-placement="left" bordered :column="3">
                <n-descriptions-item label="✅">
                    移动：WSAD 或 ↑↓←→ 键控制移动
                </n-descriptions-item>
                <n-descriptions-item label="✅">
                    长按方向键可以加速（正常速度 * 3）
                </n-descriptions-item>
                <n-descriptions-item label="✅">
                    🐭 图标是食物
                </n-descriptions-item>
                <n-descriptions-item label="✅">
                    ⛽ 图标是加强版食物（=🐭*5）
                </n-descriptions-item>
                <n-descriptions-item label="✅">
                    ⌛ 图标无敌
                </n-descriptions-item>
                <n-descriptions-item label="✅">
                    🧊 图标是随机传送
                </n-descriptions-item>
                <n-descriptions-item label="⛔">
                    🐚 图标是障碍物（无敌时间可以消除）
                </n-descriptions-item>
                <n-descriptions-item label="⛔">
                    🌈 图标给一个随机位置（无敌时间可以消除）
                </n-descriptions-item>
                <n-descriptions-item label="⛔">
                    可以穿越墙体，不可以穿越自身（无敌时间除外）
                </n-descriptions-item>
            </n-descriptions>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { calDuration } from '@/utils/calculate'
import { useI18n } from 'vue-i18n'

/* *********************************************实例化********************************************* */
const { t, setLocaleMessage, getLocaleMessage } = useI18n()

/* *********************************************国际化********************************************* */
// 定义命名空间语言包：
const currentMessages = {
    'zh-CN': {
        "GlutonousSnake": {
            "map_size": "地图大小：",
            "game_level": "游戏等级：",
            "game_speed": "游戏速度：",
            "game_score": "游戏分数：",
            "game_step": "游戏步骤：",
            "game_use_time": "游戏用时：",
            "next_level_score": "下一级分数：",
            "history_heigh_score": "历史最高分：",
            "acceleration_bar": "加速蓄力条",
            "oil_generation_probability": "汽油生成概率",
        }
    },
    'en-US': {
        "GlutonousSnake": {
            "map_size": "map size：",
            "game_level": "game level：",
            "game_speed": "game speed：",
            "game_score": "game score：",
            "game_step": "game step：",
            "game_use_time": "game use time：",
            "next_level_score": "next level score：",
            "history_heigh_score": "history heigh score：",
            "acceleration_bar": "acceleration bar",
            "oil_generation_probability": "oil generation probability",
        }
    },
}

// 加载命名空间语言包，合并到现有语言包
for (const lang of Object.keys(currentMessages)) {
    const existingMessages = getLocaleMessage(lang) || {};
    setLocaleMessage(lang, {
        ...existingMessages,
        ...currentMessages[lang as keyof typeof currentMessages],
    });
}

// 渲染地图物品类型
const renderItem = (item: number) => {
    if (item == 3) return '🐭'
    if (item == 4) return '⛽'
    if (item == 5) return '⌛'
    if (item == 6) return '🧊'
    if (item == 7) return '🐚'
    if (item == 8) return '🌈'
}
/**
 * 创建地图
 * 0 - 空地
 * 1 - 蛇身
 * 2 - 蛇头
 * 3 - 食物
 * 4 - 汽油
 * 5 - 无敌
 * 6 - 空间跳跃
 */
// 地图长宽
const map_width = 50
const map_item_width = (800 / map_width) + 'px'
const map_height = 50
const map_item_height = (600 / map_height) + 'px'
// 地图数据
const map = reactive<number[]>([])

/**
 * 贪吃蛇类
 * @param {number} x 蛇头x坐标
 * @param {number} y 蛇头y坐标
 * @param {number} speed 蛇速度
 * @returns {void}
 */
class Snake {
    // 游戏id
    #gameId: number = 0
    // 游戏状态
    #status: 'start' | 'stop' = 'stop'
    // 游戏运行时间
    startTime: number = 0
    // 游戏行动时间
    actionTime: number = 0
    // 移动步骤
    step: number = 0
    // 蛇方向
    #direction: 'up' | 'down' | 'left' | 'right' = 'right'
    // 改动方向标识（防止快速多次按键，在未渲染时就已经改变多次方向，例：渲染 → ，按下 ↓（未渲染）←（未渲染），达到下一次渲染点，→←掉头判定死亡 ）
    #chageDirection = false
    // 蛇身体（数组第一项为蛇头）
    #body: number[] = [2, 1, 0]
    // 蛇身体缓存
    #bodyCache: number = 0
    // 等级
    level: number = 1
    // 升级分数
    nextLevel: number[] = [4, 10, 20, 30, 40, 50, 60, 70, 80, 90]
    // 游戏分数
    score: number = this.#body.length
    // 蛇速度
    speed: number = 1
    // 速度缓存
    #speedCache: number = 0
    // 加速预备 -- 生成加速进度条
    speedUpReady: number = 0
    // 加速标识
    #speedUp: boolean = false
    // 游戏难度(表现出来的就是 = 难度/速度 数值越小，速度越快)
    #difficulty: number = 300
    // 食物坐标
    #food: number = 4
    // 汽油坐标，构造器生成
    gasoline: number = -1
    // 生成汽油的概率
    gasolineRate: number = 2
    // 空间跳跃坐标(表现出来的就是生成率 = 游戏分数 % 4)
    #spaceJump: [number, number] = [-1, -1]
    // 生成跳跃的频率(0 ~ 1，0表示可以生成，1表示不可以生成)
    #spaceJumpRate: number = 0
    // 空间跳跃的身体
    #spaceJumpBody: number[] = []
    // 空间跳跃进行到步骤（变更蛇头后面的位置）
    #spaceJumpStep: number = 1
    // 空间跳跃门的选定
    #spaceJumpDoor: number = -1
    // 存活
    #alive: boolean = true
    // 键盘松开事件
    #keyUpHandler: (e: KeyboardEvent) => void = () => { }
    // 键盘按下时间
    #keyDownHandler: (e: KeyboardEvent) => void = () => { }
    // 胜利
    win: boolean = false
    // 失败
    fail: boolean = false

    // 构造函数
    constructor(speed: number) {
        // 设置初始速度
        this.speed = speed
        // 初始化地图
        Array.from({ length: map_height * map_width }, (_, _i) => { map.push(0) })
        // 生成食物
        this.#drawFood()
        // 生成🐍
        this.#drawSnake()
        // 生成汽油
        this.#generateGasoline()
        // 键盘按下事件
        window.addEventListener('keydown', (e) => {
            const keyword = e.key.toLowerCase()
            switch (keyword) {
                case 'o':
                    if (this.#status == 'stop')
                        this.start()
                    break;
                case 'p':
                    if (this.#status == 'start')
                        this.stop()
                    break;
                case 'r':
                    this.restart()
                    break;
                default:
                    break;
            }
        })

    }

    // 绘制食物
    #drawFood() {
        // 将地图中食物位置设置为3
        map[this.#food] = 3
    }

    // 绘制蛇
    #drawSnake() {
        // 蛇头在地图中用2表示，蛇身用1表示
        this.#body.forEach((item, index) => {
            if (index == 0) { // 蛇头
                map[item] = 2
            } else { // 蛇身
                map[item] = 1
            }
        })
    }

    // 移动地图边界判断
    #boundary() {

        // 获取蛇头部坐标
        const header = this.#body[0]
        // 计算下一次移动头部坐标
        let index = null;
        // 不同方向不同处理
        switch (this.#direction) {
            case 'up':
                // 移动边界判断
                if (header <= map_width - 1) { // 处理第一行的问题，翻墙
                    // 计算到达的位置
                    index = map_width * (map_height - 1) + header
                    // 判断是否撞到自身（头部和最后一个尾巴不计算碰撞）
                    this.#body.slice(1, this.#body.length).includes(index) ? this.#alive = false : this.#alive = true
                } else { // 处理其他位置
                    index = header - map_width
                    // 判断是否撞到自身（头部和最后一个尾巴不计算碰撞）
                    this.#body.slice(1, this.#body.length).includes(index) ? this.#alive = false : this.#alive = true
                }

                // 如果还存活，判断是否吃到食物、道具
                this.#alive ? this.#eat(header, index) : ''
                break;
            case 'down':

                // 处理最后一行的问题，翻墙
                if (header >= (map_width * (map_height - 1))) { // 处理最后一行的问题，翻墙
                    // 计算到达的位置
                    index = header - (map_width * (map_height - 1))
                    // 判断是否撞到自身（头部和最后一个尾巴不计算碰撞）
                    this.#body.slice(1, this.#body.length).includes(index) ? this.#alive = false : this.#alive = true
                } else { // 处理其他位置
                    // 计算到达的位置
                    index = header + map_width
                    // 判断是否撞到自身（头部和最后一个尾巴不计算碰撞）
                    this.#body.slice(1, this.#body.length).includes(index) ? this.#alive = false : this.#alive = true
                }

                // 如果还存活，判断是否吃到食物、道具
                this.#alive ? this.#eat(header, index) : ''
                break;
            case 'left':
                // 移动边界判断
                if (header % 50 === 0) { // 处理第一列问题，翻墙
                    // 计算到达的位置
                    index = header + (map_width - 1)
                    // 判断是否撞到自身（头部和最后一个尾巴不计算碰撞）
                    this.#body.slice(1, this.#body.length).includes(index) ? this.#alive = false : this.#alive = true
                } else { // 处理其他位置
                    // 计算到达的位置
                    index = header - 1
                    // 判断是否撞到自身（头部和最后一个尾巴不计算碰撞）
                    this.#body.slice(1, this.#body.length).includes(index) ? this.#alive = false : this.#alive = true
                }

                // 如果还存活，判断是否吃到食物、道具
                this.#alive ? this.#eat(header, index) : ''
                break;
            case 'right':

                // 移动边界判断
                if (header >= (map_width - 1) && (header - (map_width - 1)) % 50 === 0) { // 处理最后一列问题，翻墙
                    // 计算到达的位置
                    index = header - (map_width - 1)
                    // 判断是否撞到自身（头部和最后一个尾巴不计算碰撞）
                    this.#body.slice(1, this.#body.length).includes(index) ? this.#alive = false : this.#alive = true
                } else {
                    // 计算到达的位置
                    index = header + 1
                    // 判断是否撞到自身（头部和最后一个尾巴不计算碰撞）
                    this.#body.slice(1, this.#body.length).includes(index) ? this.#alive = false : this.#alive = true
                }

                // 如果还存活，判断是否吃到食物、道具
                this.#alive ? this.#eat(header, index) : ''
                break;
        }

        // console.log(this);
    }

    // 判断是否吃到食物、道具
    #eat(header: number, index: number) {

        // 是否吃到食物
        let eatFoodSymbol = false

        /* ****************************************蛇尾处理**************************************** */

        if (header == this.#food) { // 吃到食物，概率生成汽油

            // 更变吃到食物标识
            eatFoodSymbol = true

            // 分数增加
            this.score++
            // 是否升级
            this.#levelUp()
            // 再次生成食物（没法生成食物时，结束游戏）
            this.#generateFood()

            // 当地图没有汽油时，再次概率生成汽油(如果生成失败，概率增加)
            this.gasoline < 0 && Math.random() > (1 - this.gasolineRate / 10) ? this.#generateGasoline() : this.gasolineRate++

        }

        if (header == this.gasoline) { // 吃到汽油，身体将增长5格
            // 分数增加
            this.score = this.score + 5
            // 身体缓存
            this.#bodyCache = 5
            // 是否升级
            this.#levelUp()
            // 清空汽油
            this.gasoline = -1
            // 重置概率
            this.gasolineRate = 2
        }

        // 跳跃道具门1
        if (header == this.#spaceJump[0]) { // 吃到跳跃道具，index坐标需要变更
            // 头部坐标重新变更
            index = this.#spaceJump[1]
            // 空间身体缓存
            this.#spaceJumpBody = this.#body.slice(1)
            // 跳跃门记录
            this.#spaceJumpDoor = 1
        }

        // 跳跃道具门2
        if (header == this.#spaceJump[1]) { // 吃到跳跃道具，index坐标需要变更
            // 头部坐标重新变更
            index = this.#spaceJump[0]
            // 空间身体缓存
            this.#spaceJumpBody = this.#body.slice(1)
            // 跳跃门记录
            this.#spaceJumpDoor = 0
        }


        /* ****************************************蛇尾处理**************************************** */

        if (eatFoodSymbol == false && this.#bodyCache <= 0 && this.#spaceJumpBody.length == 0) {
            // 如果 没有吃到食物/没有身体缓存/没有空间身体 则更新地图数据后，移除尾巴，移动蛇头
            map[this.#body[this.#body.length - 1]] = 0 // 清除尾巴所在地图的位置
            this.#body.pop() // 移除尾巴
            this.#body.unshift(index) // 移动蛇头
            return;
        } else if (eatFoodSymbol == true && this.#bodyCache <= 0 && this.#spaceJumpBody.length == 0) {
            // 如果 吃到食物/没有身体缓存/没有空间身体 则尾巴存留，头部移动
            this.#body.unshift(index) // 移动蛇头
        } else if (eatFoodSymbol == false && this.#bodyCache > 0 && this.#spaceJumpBody.length == 0) {
            // 如果 没有吃到食物/有身体缓存/没有空间身体 则尾巴保持不变，身体缓存减少，移动蛇头
            this.#bodyCache-- // 身体缓存减少
            this.#body.unshift(index) // 移动蛇头
            return;
        } else if (eatFoodSymbol == false && this.#bodyCache <= 0 && this.#spaceJumpBody.length > 0) {

            console.log(this.#body);

            // 如果 没有吃到食物/没有身体缓存/有空间身体 则进行更新地图数据、清除尾巴后，进行头部以及身体的空间移动
            map[this.#body[this.#body.length - 1]] = 0 // 清除尾巴所在地图的位置
            this.#body.pop() // 移除尾巴

            if (this.#spaceJumpStep == 1) { // 先移动蛇头
                this.#body.unshift(index)
                this.#spaceJumpStep++
            }

            if (this.#spaceJumpStep !== 1) { // 后移蛇头和蛇身
                // 移动蛇头
                this.#body.unshift(index)
                // 蛇身空间跳跃(变更蛇头后面的位置，同时记录空间跳跃的步骤)
                this.#body[this.#spaceJumpStep - 1] = this.#spaceJump[this.#spaceJumpDoor]
                this.#spaceJumpStep++
                // 空间跳跃是否完成
                if (this.#spaceJumpStep == this.#spaceJumpBody.length) {
                    // 清空跳跃道具
                    map[this.#spaceJump[0]] = 0 // 清除地图跳跃道具
                    map[this.#spaceJump[1]] = 0 // 清除地图跳跃道具
                    this.#spaceJumpStep = 1 // 重置跳跃步骤
                    this.#spaceJumpBody = [] // 清空跳跃身体
                    this.#spaceJumpDoor = -1 // 重置跳跃门
                    this.#spaceJump = [-1, -1] // 重置跳跃道具
                    this.#spaceJumpRate = 0 // 允许空间跳跃生成
                }
            }

            return;
        }


    }

    // 生成随机位置的食物，不与蛇身体、道具节点重叠
    #generateFood() {
        // 计算地图中还有多少空白节点
        const blankArea: number[] = map.flatMap((item, index) => item == 0 ? 0 : index)
        // 空白数量
        const count = blankArea.filter(item => item == 0).length
        // 已经无法在地图上生成食物，则游戏结束，显示胜利界面
        if (count <= 1) {
            this.win = true
            win.value = true
            console.log("🚀 ~ Snake ~ #generateFood ~ win:", '胜利方式：无法生成食物')
            this.stop()
        }

        // 从blankArea中空白数量 生成一个坐标（如果使用map【地图】循环会造成大量的密集型计算）
        for (let index = 0; index < count; index++) {
            // 最后一次循环，强制生成
            if (index == count - 1) {
                // 拿到所有空白区域第一个坐标
                const i = blankArea.findIndex(item => item == 0)
                map[i] = 3
            }
            // 生成随机坐标
            const randomIndex = Math.floor(Math.random() * count)
            // 判断坐标是否与蛇身体或者道具重叠
            if (map[randomIndex] == 0) {
                // 食物坐标赋值
                this.#food = randomIndex
                return
            }
        }

    }

    // 生成边角位置的汽油，不与蛇身体、道具节点重叠
    #generateGasoline() {
        // 获取所有边界空白的位置
        const array: number[] = []
        // 第一行
        Array.from({ length: map_width }, (_, i) => { array.push(i) })
        // 最后一行
        Array.from({ length: map_width }, (_, i) => { array.push(map_width * (map_height - 1) + i) })
        // 第一列，不要头和尾巴
        Array.from({ length: map_height - 2 }, (_, i) => { array.push((i + 1) * 50) })
        // 最后一列，不要头和尾巴
        Array.from({ length: map_height - 2 }, (_, i) => { array.push((i + 2) * 50 - 1) })
        // 取出地图四周空白的位置
        const commonArray = array.filter((item, _index) => map[item] == 0)
        // 已经无法在地图界面边界上生成汽油，
        if (commonArray.length == 0) return;
        // 取出一个空白周边索引
        const index = Math.floor(Math.random() * commonArray.length)
        // 汽油坐标赋值
        this.gasoline = commonArray[index]
        // 绘制
        map[this.gasoline] = 4
    }

    // 空间跳跃（时间段生成）
    #generateSpaceJump() {

        // 判断是否满足条件
        if (this.score % 4 == 0 && this.#spaceJumpRate == 0) {

            // 判断地图没有空间跳跃的位置
            if (this.#spaceJump[0] == -1 && this.#spaceJump[1] == -1) {

                // 计算地图中还有多少空白节点坐标
                const blankArea: number[] = map.flatMap((item, index) => item == 0 ? 0 : index)
                // 空白数量
                const count = blankArea.filter(item => item == 0).length
                // 已经无法在地图上生成空间门，则跳过
                if (count <= 2) {
                    this.win = true
                    win.value = true
                    console.log("🚀 ~ Snake ~ #generateFood ~ win:", '胜利方式：无法生成空间跳跃')
                    this.stop()
                }

                // 随机获取两个空白位置(一定要是不同的位置，使用count减少循环次数)
                for (let index = 0; index < count; index++) {
                    // 随机获取一个值
                    const index1 = Math.floor(Math.random() * count)
                    // 再随机获取一个值
                    const index2 = Math.floor(Math.random() * count)
                    if (index1 !== index2) {
                        this.#spaceJump = [index1, index2]
                        break;
                    }

                    // 最后一次循环，则强制生成两个地点
                    if (index == count - 1) {
                        this.#spaceJump = [map[blankArea.findIndex(i => i == 0)], map[blankArea.findLastIndex(i => i == 0)]]
                    }

                }

                // 绘制
                map[this.#spaceJump[0]] = 6
                map[this.#spaceJump[1]] = 6

                // 禁止传送生成
                this.#spaceJumpRate = 1

            }

        }

    }

    // 升级逻辑
    #levelUp() {
        // 将下一等级的经验值更新
        if (this.score >= this.nextLevel[this.level - 1]) {
            // 升级
            this.speed++
            this.level++
            // 升级完成时，如果处于加速状态需要特殊处理速度缓存也要自增
            if (this.#speedUp) {
                this.#speedCache++
                this.speed = this.level * 3
            }
        }
    }

    // 核心交互
    #move() {

        // 是否到达当前难度的时间点
        if (Date.now() - this.actionTime >= this.#difficulty / this.speed) {

            // 是否存活
            if (!this.#alive) {
                // 死亡，结束游戏，显示失败界面
                this.fail = true
                fail.value = true
                this.stop()
                return
            }

            // 记录当前时间
            this.actionTime = Date.now()
            // 改动变更方向的标识
            this.#chageDirection = false
            // 边界，存活，吃食物逻辑判断
            this.#boundary()
            // 移动完后绘制
            this.#drawFood()
            this.#drawSnake();
            // 检测是否需要生成空间跳跃
            this.#generateSpaceJump()
            // 移动步骤增加
            this.step++
        }
        // 继续逻辑
        this.#gameId = requestAnimationFrame(this.#move.bind(this))
    }

    // 解释方向
    #explainDirection(key: string) {
        switch (key) {
            case 'arrowup':
                return 'up'
            case 'arrowdown':
                return 'down'
            case 'arrowleft':
                return 'left'
            case 'arrowright':
                return 'right'
            case 'w':
                return 'up'
            case 's':
                return 'down'
            case 'a':
                return 'left'
            case 'd':
                return 'right'
            default:
                break;
        }
    }

    // 反方向阻止
    #stopReverseDirection(key: string) {
        if (key === 'arrowdown' && this.#direction === 'up') return true;
        if (key === 'arrowup' && this.#direction === 'down') return true;
        if (key === 'arrowright' && this.#direction === 'left') return true;
        if (key === 'arrowleft' && this.#direction === 'right') return true;
        if (key === 'w' && this.#direction === 'up') return true;
        if (key === 's' && this.#direction === 'down') return true;
        if (key === 'a' && this.#direction === 'right') return true;
        if (key === 'd' && this.#direction === 'left') return true;
    }

    // 开始游戏
    start() {

        /* ******************注册键盘事件****************** */
        // 松开键盘事件（取消加速）
        this.#keyUpHandler = (_e) => {

            // 如果有加速标识，松开按钮则加速结束
            if (this.#speedUp) {
                // 关闭加速标识
                this.#speedUp = false
                // 恢复原来的速度
                this.speed = this.#speedCache
                this.#speedCache = 0
                this.speedUpReady = 0
            }

            // 否则清空蓄力条
            this.speedUpReady = 0

        }

        // 按下键盘事件（改变移动方向，需要判断是不是蛇掉头，如果是掉头则保持原方向，判断是否需要加速）
        this.#keyDownHandler = (e) => {
            // 处理大小写
            const keyword = e.key.toLowerCase()

            // 如果是同方向，则加速
            if (this.#direction === this.#explainDirection(keyword)) {
                // 不松手就加速预备蓄力
                this.speedUpReady < 10 ? this.speedUpReady++ : '';
                // 到达蓄力值且没有加速
                if (this.speedUpReady >= 10 && !this.#speedUp) {
                    // 加速标识开启
                    this.#speedUp = true
                    // 缓存原速(一旦缓存则只能在升级模块更改，否则会导致升级bug)
                    this.#speedCache = this.speed
                    // 提速3倍
                    this.speed = this.speed * 3
                }
                // 同方向不执行后续逻辑
                return;
            }

            // 变更方向暂未结束且方向一致，则等待变更完成，或者按下其他方向键
            if (!this.#chageDirection && this.#direction !== this.#explainDirection(keyword)) {
                // 改变方向
                switch (keyword) {
                    case 'w':
                        this.#stopReverseDirection(keyword) ? '' : this.#direction = 'up'
                        break;
                    case 's':
                        this.#stopReverseDirection(keyword) ? '' : this.#direction = 'down'
                        break;
                    case 'a':
                        this.#stopReverseDirection(keyword) ? '' : this.#direction = 'left'
                        break;
                    case 'd':
                        this.#stopReverseDirection(keyword) ? '' : this.#direction = 'right'
                        break;
                    case 'arrowup':
                        this.#stopReverseDirection(keyword) ? '' : this.#direction = 'up'
                        break;
                    case 'arrowdown':
                        this.#stopReverseDirection(keyword) ? '' : this.#direction = 'down'
                        break;
                    case 'arrowleft':
                        this.#stopReverseDirection(keyword) ? '' : this.#direction = 'left'
                        break;
                    case 'arrowright':
                        this.#stopReverseDirection(keyword) ? '' : this.#direction = 'right'
                        break;
                    case ' ':
                        break;
                }
                // 改动变更方向的标识
                this.#chageDirection = true

            }

        }

        // 注册监听键盘事件
        window.addEventListener('keyup', this.#keyUpHandler)
        window.addEventListener('keydown', this.#keyDownHandler)

        /* ******************开始游戏****************** */
        // 记录游戏状态、开始时间和行动时间
        const time = Date.now()
        this.startTime = time
        this.actionTime = time
        this.#status = 'start'
        // 运行游戏
        this.#move()
    }

    // 停止游戏
    stop() {
        // 取消运行
        this.#status = 'stop'
        cancelAnimationFrame(this.#gameId)
        // 取消监听键盘注册事件
        window.removeEventListener('keyup', this.#keyUpHandler)
        window.removeEventListener('keydown', this.#keyDownHandler)
    }

    // 重新开始
    restart() {
        // 如果游戏正在运行，则不执行
        if (this.#status === 'start') return;

        map.length = 0
        // 初始化地图
        Array.from({ length: map_height * map_width }, (_, _i) => { map.push(0) })

        /* *****************************数据重置（后期可以降低难度）***************************** */
        // 游戏开始时间
        this.startTime = 0
        // 游戏开始时间
        this.actionTime = 0
        // 移动步骤
        this.step = 0
        // 蛇方向
        this.#direction = 'right'
        // 蛇方向变动标识
        this.#chageDirection = false
        // 蛇身体
        this.#body = [2, 1, 0]
        // 蛇身体缓存
        this.#bodyCache = 0
        // 等级
        this.level = 1
        // 升级分数
        this.nextLevel = [4, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        // 游戏分数
        this.score = this.#body.length
        // 蛇速度
        this.speed = 1
        // 速度缓存
        this.#speedCache = 0
        // 加速预备
        this.speedUpReady = 0
        // 加速标识
        this.#speedUp = false
        // 游戏难度(表现数来的就是 = 难度/速度)
        // this.#difficulty = 300
        // 食物坐标
        this.#food = 4
        // 汽油坐标，构造器生成
        this.gasoline = -1
        // 生成汽油的概率
        this.gasolineRate = 2
        // 存活
        this.#alive = true
        // 胜利
        this.win = false
        // 失败
        this.fail = false

        // 生成食物
        this.#drawFood()
        // 生成🐍
        this.#drawSnake()
        // 生成汽油
        this.#generateGasoline()
        // 开始游戏
        this.start()

        // 显示游戏界面
        fail.value = false
    }
}

// 创建蛇实例
const snake = new Snake(1)
// 游戏结束界面
const fail = ref(false)
// 游戏胜利界面
const win = ref(false)

</script>

<style lang="scss" scoped>
.container {
    min-width: 980px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.game {
    display: flex;
    flex: 100%;
    justify-content: center;
    gap: 10px;


    // 游戏地图容器
    .map-container {
        min-width: 800px;
        width: 800px;
        min-height: 600px;
        height: 600px;
        display: flex;
        flex-wrap: wrap;
        background: url("./resource/background.png") no-repeat center/100%;
        position: relative;

        // 游戏内容
        .map-content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;

            .map-item {
                // 每12个元素换行 600/12 = 50
                width: v-bind(map_item_width);
                height: v-bind(map_item_height);
                // 垂直水平居中
                display: flex;
                justify-content: center;
                align-items: center;
                // 确保元素边框和内边距不会影响元素大小
                box-sizing: border-box;
                // outline: 1px solid #ccc;

            }


            // 蛇身
            .map-item-style-1 {
                background: rgb(0, 174, 255);
                box-shadow: 0 0 10px rgb(0, 174, 255);
            }

            // 蛇头
            .map-item-style-2 {
                overflow: hidden;
            }

            // 蛇头动画
            .map-item-style-2::after {
                content: '';
                width: 100%;
                height: 100%;
                border-radius: 20%;
                animation: rgbColor 0.3s linear infinite;
            }

            // 食物
            .map-item-style-3 {
                text-shadow: 2px 2px 8px rgb(255, 217, 0);
            }

            // 汽油
            .map-item-style-4 {
                text-shadow:
                    1px 1px 10px rgb(255, 0, 0),
                    -1px -1px 10px rgb(255, 0, 0),
                    1px -1px 10px rgb(255, 0, 0),
                    -1px 1px 10px rgb(255, 0, 0)
            }


            @keyframes rgbColor {
                from {
                    background: rgb(21, 255, 0);
                }

                50% {
                    background: rgb(225, 255, 0);
                }

                to {
                    background: rgb(255, 157, 0);
                }

            }

            // 空间们
            .map-item-style-6 {
                text-shadow:
                    1px 1px 10px rgb(26, 255, 0),
                    -1px -1px 10px rgb(26, 255, 0),
                    1px -1px 10px rgb(26, 255, 0),
                    -1px 1px 10px rgb(26, 255, 0)
            }
        }

        // 游戏失败
        .map-fail {
            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;

            .restart-button {
                background: #fff;
                border: none;
                padding: 10px 20px;
                display: inline-block;
                font-size: 15px;
                font-weight: 600;
                width: 140px;
                text-transform: uppercase;
                cursor: pointer;
                transform: skew(-21deg);

                & span {
                    color: #ed9821;
                    display: inline-block;
                    transform: skew(21deg);
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 100%;
                    left: 0;
                    background: rgb(20, 20, 20);
                    opacity: 0;
                    z-index: -1;
                    transition: all 0.5s;
                }

                &:hover {
                    color: #fff;
                }

                &:hover::before {
                    left: 0;
                    right: 0;
                    opacity: 1;
                }
            }

            // 模态框
            &::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
            }
        }
    }


    // 地图属性
    .map-info {
        min-width: 200px;
        width: 300px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        gap: 10px;

        .keyword-button {
            --key-text-color: #969faf;
            --docsearch-key-shadow: inset 0 -2px 0 0 #c5c5db, inset 0 0 1px 1px #fff,
                0 1px 2px 1px rgba(30, 35, 90, 0.4);
            --docsearch-key-gradient: linear-gradient(-225deg, #c9cfd8, #f2f1f1);
            border: none;
            background: var(--docsearch-key-gradient);
            border-radius: 3px;
            box-shadow: var(--docsearch-key-shadow);
            color: var(--key-text-color);
            cursor: pointer;
            height: 2.5em;
            text-align: center;
            padding: 0.6em;
            margin: 0 0.6em;
            display: inline-block;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 1em;
            min-width: 1em;
            line-height: 1em;
            user-select: none;
        }
    }
}

.game-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex: 100%;
    padding: 20px;
}
</style>