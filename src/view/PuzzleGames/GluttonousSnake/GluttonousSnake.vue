<template>

    <div class="container">
        <div class="game">
            <!-- 渲染地图 -->
            <div class="map-container">
                <div class="map-content">
                    <div :class="'map-item map-item-style-' + `${item}`" :data-index="i" v-for="(item, i) in map"
                        :key="i">
                        {{ renderItem(item) }}
                    </div>
                </div>
                <div v-if="fail" class="map-fail">
                    <button class="restart-button" @click="snake.restart()">
                        <span>重新开始</span>
                    </button>
                </div>
            </div>
            <div class="map-info">
                <div class="w-full flex flex-wrap gap-2 justify-center">
                    <button class="keyword-button" :disabled="fail" @click="snake.start()">O(开始)</button>
                    <button class="keyword-button" :disabled="fail" @click="snake.stop()">P(停止)</button>
                </div>
                <div class="w-full flex pl-3 border border-gray-400">
                    <ul>
                        <li>地图大小：{{ map_width }} * {{ map_height }}</li>
                        <li>游戏等级：{{ snake.level }}</li>
                        <li>游戏速度：{{ snake.speed }}</li>
                        <li>游戏分数：{{ snake.score }}</li>
                        <li>游戏步骤：{{ snake.step }}</li>
                        <li>游戏用时：{{ snake.startTime == 0 ? 0 : calDuration(snake.startTime) }}</li>
                        <li>下一级分数：{{ Math.abs(snake.nextLevel[snake.level - 1] - snake.score) }}</li>
                        <li>历史最高分：{{ snake.score }}</li>
                    </ul>
                </div>
                <div class="w-full text-lg font-bold">加速蓄力条</div>
                <n-progress class="w-full" type="line" status="warning" :percentage="snake.speedUpReady * 10"
                    indicator-placement="inside" />
                <div class="w-full text-lg font-bold">汽油生成概率</div>
                <n-progress class="w-full" type="line" status="error"
                    :percentage="snake.gasoline >= 0 ? 0 : snake.gasolineRate * 10" indicator-placement="inside" />
            </div>
        </div>
        <div class="game-info">
            <n-descriptions title="游戏规则：" label-placement="left" bordered :column="3">
                <n-descriptions-item label="✅">
                    移动：WSAD 或 ↑↓←→ 键控制移动
                </n-descriptions-item>
                <n-descriptions-item label="✅">
                    长按方向键可以加速
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
                    🎪 图标是随机传送
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
// 渲染地图物品类型
const renderItem = (item: number) => {
    if (item == 3) return '🐭'
    if (item == 4) return '⛽'
    if (item == 5) return '⌛'
    if (item == 6) return '🎪'
    if (item == 7) return '🐚'
}
/**
 * 创建地图
 * 0 - 空地
 * 1 - 蛇身
 * 2 - 蛇头
 * 3 - 食物
 * 4 - 汽油
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
    nextLevel: number[] = [4, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    // 游戏分数
    score: number = this.#body.length
    // 蛇速度
    speed: number = 1
    // 速度缓存
    #speedCache: number = 0
    // 加速预备
    speedUpReady: number = 0
    // 加速标识
    #speedUp: boolean = false
    // 游戏难度(表现数来的就是 = 难度/速度)
    #difficulty: number = 300
    // 食物坐标
    #food: number = 4
    // 汽油坐标，构造器生成
    gasoline: number = -1
    // 生成汽油的概率
    gasolineRate: number = 2
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
            if (index == 0) {
                map[item] = 2
            } else {
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

                // 如果还存活，判断是否吃到食物
                if (this.#alive) {
                    // 判断是否吃到食物、道具
                    this.#eat(header)
                    // 移动蛇头
                    this.#body.unshift(index)
                };

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

                if (this.#alive) {
                    // 判断是否吃到食物
                    this.#eat(header)
                    // 移动蛇头
                    this.#body.unshift(index)
                }
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

                if (this.#alive) {
                    // 判断是否吃到食物
                    this.#eat(header)
                    // 移动蛇头
                    this.#body.unshift(index)
                }
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

                if (this.#alive) {
                    // 判断是否吃到食物
                    this.#eat(header)
                    // 移动蛇头
                    this.#body.unshift(index)
                }
                break;
        }
    }

    // 判断是否吃到食物、道具
    #eat(header: number) { // 吃到食物，身体将增长1格
        if (header == this.#food) {
            // 分数增加
            this.score++
            // 是否升级
            this.#levelUp()
            // 再次生成食物（没法生成食物时，结束游戏）
            this.#generateFood()
            // 再次生成汽油（概率生成，概率会不断增加）
            if (Math.random() > (1 - this.gasolineRate / 10) && this.gasoline < 0) {
                this.#generateGasoline()
            } else {
                this.gasolineRate++
            }
        } else { // 没有吃到食物
            if (this.#bodyCache > 0) { // 如果有身体缓存，不删除尾巴
                this.#bodyCache--
            } else { // 更新尾巴地图数据，然后移除尾巴
                map[this.#body[this.#body.length - 1]] = 0
                this.#body.pop()
            }
        }

        // 吃到汽油，身体将增长5格
        if (header == this.gasoline) {
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
    }

    // 生成随机位置的食物，不与蛇身体、道具节点重叠
    #generateFood() {
        // 计算地图中还有多少0
        const count = map.filter(item => item == 0).length
        // 剩余循坏次数
        let count_loop = 0
        // 生成食物坐标，不能与蛇身体节点重叠
        for (let index = 0; index < count; index++) {
            // 剩余次数不足
            if (count_loop >= count) {
                // 已经无法在地图上生成食物，则游戏结束，显示胜利界面
                this.win = true
                win.value = true
                this.stop()
            }
            // 生成随机坐标
            const random = Math.floor(Math.random() * map_width * map_height)
            // 判断是否与蛇身体节点重叠
            if (!this.#body.includes(random)) {
                this.#food = random
            }

            // 每次循环次数增加
            count_loop++
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
        // 取出一个空白周边索引
        const index = Math.floor(Math.random() * commonArray.length)
        // 赋值给汽油位置
        this.gasoline = commonArray[index]
        // 绘制
        map[this.gasoline] = 4
    }

    // 升级逻辑
    #levelUp() {
        // 将下一等级的经验值更新
        if (this.score >= this.nextLevel[this.speed - 1]) {
            // 升级
            this.speed++
            this.level++
        }
    }

    // 核心交互
    #move() {
        // 是否存活
        if (!this.#alive) {
            // 死亡，结束游戏，显示失败界面
            this.fail = true
            fail.value = true
            this.stop()
            return
        }

        // 是否到达当前难度的时间点
        if (Date.now() - this.actionTime >= this.#difficulty / this.speed) {
            // 记录当前时间
            this.actionTime = Date.now()
            // 改动变更方向的标识
            this.#chageDirection = false
            // 边界，存活，吃食物逻辑判断
            this.#boundary()
            // 移动完后绘制
            this.#drawFood()
            this.#drawSnake()
            // 移动步骤增加
            this.step++
        }
        // 继续逻辑
        this.#gameId = requestAnimationFrame(this.#move.bind(this))
    }

    // 解释方向
    #explainDirection(key: string) {
        switch (key) {
            case 'ArrowUp':
                return 'up'
            case 'ArrowDown':
                return 'down'
            case 'ArrowLeft':
                return 'left'
            case 'ArrowRight':
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
        if (key === 'ArrowDown' && this.#direction === 'up') return true;
        if (key === 'ArrowUp' && this.#direction === 'down') return true;
        if (key === 'ArrowRight' && this.#direction === 'left') return true;
        if (key === 'ArrowLeft' && this.#direction === 'right') return true;
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
            // 如果是同方向，则加速
            if (this.#direction === this.#explainDirection(e.key)) {
                // 不松手就加速预备蓄力
                this.speedUpReady < 10 ? this.speedUpReady++ : '';
                // 到达蓄力值且没有加速
                if (this.speedUpReady >= 10 && !this.#speedUp) {
                    // 加速标识开启
                    this.#speedUp = true
                    // 缓存原速
                    this.#speedCache = this.speed
                    // 提速3倍
                    this.speed = this.speed * 3
                }
                // 同方向不执行后续逻辑
                return;
            }

            // 变更方向暂未结束且方向一致，则等待变更完成，或者按下其他方向键
            if (!this.#chageDirection && this.#direction !== this.#explainDirection(e.key)) {
                // 改变方向
                switch (e.key) {
                    case 'w':
                        this.#stopReverseDirection(e.key) ? '' : this.#direction = 'up'
                        break;
                    case 's':
                        this.#stopReverseDirection(e.key) ? '' : this.#direction = 'down'
                        break;
                    case 'a':
                        this.#stopReverseDirection(e.key) ? '' : this.#direction = 'left'
                        break;
                    case 'd':
                        this.#stopReverseDirection(e.key) ? '' : this.#direction = 'right'
                        break;
                    case 'ArrowUp':
                        this.#stopReverseDirection(e.key) ? '' : this.#direction = 'up'
                        break;
                    case 'ArrowDown':
                        this.#stopReverseDirection(e.key) ? '' : this.#direction = 'down'
                        break;
                    case 'ArrowLeft':
                        this.#stopReverseDirection(e.key) ? '' : this.#direction = 'left'
                        break;
                    case 'ArrowRight':
                        this.#stopReverseDirection(e.key) ? '' : this.#direction = 'right'
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
        // 记录开始时间和行动时间
        const time = Date.now()
        this.startTime = time
        this.actionTime = time
        // 运行游戏
        this.#move()
    }

    // 停止游戏
    stop() {
        // 取消运行
        cancelAnimationFrame(this.#gameId)
        // 取消监听键盘注册事件
        window.removeEventListener('keyup', this.#keyUpHandler)
        window.removeEventListener('keydown', this.#keyDownHandler)
    }

    // 重新开始
    restart() {
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
                width: 120px;
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