import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import fs from 'fs';
import path from 'path'
import { data } from 'cheerio/lib/api/attributes';

async function  INFO(url:string|undefined): Promise<Array<Array<string>>> {
    let rows:Array<Array<string>> = []
    if(typeof url === "string"){    
        const res = await axios.get(url+"spec/?lid=spec_anchorlink_details#tab",{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
        }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let row: Array<string> = [];
        $('.tblBorderGray.mTop15 tr td').each((i: Number, elem: cheerio.Element) => {
            
            row.push($(elem).text())
        })
        rows.push(row)
        console.table(rows)
    }
    return rows;
}

interface CPU {
    name: string;
    developer: string;
    rank: string;
    pricestr: string;
    price: number;
    socket: string;
    imgurl: string|undefined;
    url: string|undefined;
    seccache: string
    clk: string
    mxclk: string
    watt: string
    core: string
    thread: string
}

async function getCPU (): Promise<CPU[]> {
    const url: string = 'https://kakaku.com/pc/cpu/ranking_0510/'
    let item: Array<CPU> = []
    for(let i = 0;i < 4;i++){
        const url1 = url+"?page="+(i+1).toString()
        console.log(url1)
        const res = await axios.get(url+"?page="+(i+1).toString(),{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
            }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let name: Array<string> = []
        let developer: Array<string> = []
        let rank: Array<string> = []
        let pricestr: Array<string> = []
        let price: Array<number> = []
        let imgurl: Array<string|undefined> = []
        let socket: Array<string> = []
        let clock: Array<string> = []
        let seccache: Array<string> = []
        let watt: Array<string> = []
        let core: Array<string> = []
        let thread: Array<string> = []
        let mxclk: Array<string> = []
        $('.rkgBoxNameItem').each((i: Number, elem: cheerio.Element) => {
            name.push($(elem).text())
        })
        $('.rkgBoxNameMaker').each((i: Number, elem: cheerio.Element) => {
            let tmp: string = ""
            if($(elem).text()!="AMD") tmp = "Intel";
            else tmp = "AMD"
            developer.push(tmp)
        })
        $('.num','.rkgBoxNum').each((i: Number, elem: cheerio.Element) => {
            rank.push($(elem).text())
        })
        $('.price').each((i: Number, elem: cheerio.Element) => {
            let iprice = 0
            pricestr.push($(elem).text())
            var str = $(elem).text()
            str = str.replace("¥","")
            str = str.replace(",","")
            iprice = Number(str)
            price.push(iprice)
        })
        $('.rkgItemImg img').each((i: Number, elem: cheerio.Element) => {
            var tmp = $(elem).attr('src')
            imgurl.push(tmp)
        })
        /*$('.rkgRow.rowDetail').each((i: Number, elem: cheerio.Element) => {
            let tmp = $(elem).text()
            let tmp1 = tmp.split("：")
            let clk = tmp1[2]
            if(tmp1[2].indexOf(" ソケット形状")!=-1){
                clk = tmp1[2].replace(" ソケット形状","")
            }
            let sket = tmp1[3]
            if(tmp1.length>3 && tmp1[3].indexOf(" 二次キャッシュ")!=-1){
                sket = tmp1[3].replace(" 二次キャッシュ","")
            }
            let scache = ""
            if(tmp1.length>4){
                scache = tmp1[4]
            }
            socket.push(sket)
            //console.log(tmp1)
            clock.push(clk)
            seccache.push(scache)
        })*/
        var ur:Array<string|undefined> = [];
        $('.rkgBoxLink').each((i: Number, elem: cheerio.Element) => {
            ur.push($(elem).attr('href'))
            //console.log(tmp)
        })
        for(let i=0;i<ur.length;i++){
            console.log(ur[i])
            try{
                const info: Array<Array<string>> = await INFO(ur[i])
                socket.push(info[0][2])
                clock.push(info[0][5])
                mxclk.push(info[0][6])
                seccache.push(info[0][10])
                watt.push(info[0][4])
                core.push(info[0][3])
                thread.push(info[0][7])
            }catch (e){
                socket.push("")
                clock.push("")
                mxclk.push("")
                seccache.push("")
                watt.push("")
                core.push("")
                thread.push("")
                console.log(e)
            }
            

            await new Promise(resolve => setTimeout(resolve, 10))
        }
        for (let i = 0;i < name.length;i++){
            let cont: CPU = {
                name: name[i],
                developer: developer[i],
                rank: rank[i],
                price: price[i],
                pricestr: pricestr[i],
                imgurl: imgurl[i],
                url:ur[i],
                socket: socket[i],
                seccache: seccache[i],
                clk: clock[i],
                mxclk: mxclk[i],
                watt: watt[i],
                core: core[i],
                thread: thread[i]
            }
            item.push(cont)
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        
    }
    
    return item
}

interface GPU {
    name: string;
    developer: string;
    rank: string;
    pricestr: string;
    price: number;
    imgurl: string|undefined;
    url: string|undefined;
    Chip: string
    PCIE: string
    Memory: string
    Terminal: string
    watt: string
}

async function getGPU (): Promise<GPU[]> {
    const url: string = 'https://kakaku.com/pc/videocard/ranking_0550/'
    let item: Array<GPU> = []
    for(let i = 0;i < 11;i++){
        const url1 = url+"?page="+(i+1).toString()
        console.log(url1)
        const res = await axios.get(url+"?page="+(i+1).toString(),{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
            }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let name: Array<string> = []
        let developer: Array<string> = []
        let rank: Array<string> = []
        let pricestr: Array<string> = []
        let price: Array<number> = []
        let imgurl: Array<string|undefined> = []
        let chips: Array<string> = []
        let bassi: Array<string> = []
        let monitor: Array<string> = []
        let memory: Array<string> = []
        let watt: Array<string> = []
        $('.rkgBoxNameItem').each((i: Number, elem: cheerio.Element) => {
            name.push($(elem).text())
        })
        $('.rkgBoxNameMaker').each((i: Number, elem: cheerio.Element) => {
            developer.push($(elem).text())
        })
        $('.num','.rkgBoxNum').each((i: Number, elem: cheerio.Element) => {
            rank.push($(elem).text())
        })
        $('.price').each((i: Number, elem: cheerio.Element) => {
            let iprice = 0
            pricestr.push($(elem).text())
            var str = $(elem).text()
            str = str.replace("¥","")
            str = str.replace(",","")
            iprice = Number(str)
            price.push(iprice)
        })
        $('.rkgItemImg img').each((i: Number, elem: cheerio.Element) => {
            var tmp = $(elem).attr('src')
            imgurl.push(tmp)
        })
        /*$('.rkgRow.rowDetail').each((i: Number, elem: cheerio.Element) => {
            let tmp = $(elem).text()
            let tmp1 = tmp.split("：")
            let chip = tmp1[1]
            if(tmp1[1].indexOf(" バスインターフェイス")!=-1){
                chip = tmp1[1].replace(" バスインターフェイス","")
            }
            let Bintr = tmp1[2]
            if(tmp1.length>2 && tmp1[2].indexOf(" モニタ端子")!=-1){
                Bintr = tmp1[2].replace(" モニタ端子","")
            }
            let term = tmp1[3]
            if(tmp1.length>3 && tmp1[3].indexOf(" メモリ")!=-1){
                term = tmp1[3].replace(" メモリ", "")
            }
            let mem = ""
            if(tmp1.length>4){
                mem = tmp1[4]
            }
            chips.push(chip)
            console.log(tmp1)
            bassi.push(Bintr)
            monitor.push(term)
            memory.push(mem)
        })*/
        var ur:Array<string|undefined> = [];
        $('.rkgBoxLink').each((i: Number, elem: cheerio.Element) => {
            ur.push($(elem).attr('href'))
            //console.log(tmp)
        })
        for(let i=0;i<ur.length;i++){
            console.log(ur[i])
            try{
                const info: Array<Array<string>> = await INFO(ur[i])
                chips.push(info[0][0])
                memory.push(info[0][1])
                bassi.push(info[0][6])
                monitor.push(info[0][8])
                watt.push(info[0][13])
            }catch (e){
                chips.push("")
                memory.push("")
                bassi.push("")
                monitor.push("")
                watt.push("")
                console.log(e)
            }
            

            await new Promise(resolve => setTimeout(resolve, 10))
        }
        for (let i = 0;i < name.length;i++){
            let cont: GPU = {
                name: name[i],
                developer: developer[i],
                rank: rank[i],
                price: price[i],
                pricestr: pricestr[i],
                imgurl: imgurl[i],
                url: ur[i],
                Chip: chips[i],
                PCIE: bassi[i],
                Terminal: monitor[i],
                Memory: memory[i],
                watt: watt[i]
            }
            item.push(cont)
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        
    }
    
    return item
}

interface MB{
    name: string
    developer: string
    rank: string
    imgurl: string|undefined
    url: string|undefined
    socket: string
    size: string
    memory: string
    chipset: string
    price: number
    pricestr: string
}

async function getMB (): Promise<MB[]> {
    const url: string = 'https://kakaku.com/pc/motherboard/ranking_0540/'
    let item: Array<MB> = []
    for(let i = 0;i < 11;i++){
        const url1 = url+"?page="+(i+1).toString()
        console.log(url1)
        const res = await axios.get(url+"?page="+(i+1).toString(),{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
            }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let name: Array<string> = []
        let developer: Array<string> = []
        let rank: Array<string> = []
        let pricestr: Array<string> = []
        let price: Array<number> = []
        let imgurl: Array<string|undefined> = []
        let soc: Array<string> = []
        let size: Array<string> = []
        let chipset: Array<string> = []
        let memory: Array<string> = []
        $('.rkgBoxNameItem').each((i: Number, elem: cheerio.Element) => {
            name.push($(elem).text())
        })
        $('.rkgBoxNameMaker').each((i: Number, elem: cheerio.Element) => {
            developer.push($(elem).text())
        })
        $('.num','.rkgBoxNum').each((i: Number, elem: cheerio.Element) => {
            rank.push($(elem).text())
        })
        $('.price').each((i: Number, elem: cheerio.Element) => {
            let iprice = 0
            pricestr.push($(elem).text())
            var str = $(elem).text()
            str = str.replace("¥","")
            str = str.replace(",","")
            iprice = Number(str)
            price.push(iprice)
        })
        $('.rkgItemImg img').each((i: Number, elem: cheerio.Element) => {
            var tmp = $(elem).attr('src')
            imgurl.push(tmp)
        })
        /*$('.rkgRow.rowDetail').each((i: Number, elem: cheerio.Element) => {
            let tmp = $(elem).text()
            let tmp1 = tmp.split("：")
            let siz = tmp1[1]
            if(tmp1[1].indexOf(" CPUソケット")!=-1){
                siz = tmp1[1].replace(" CPUソケット","")
            }
            let skt = tmp1[2]
            if(tmp1.length>2 && tmp1[2].indexOf(" チップセット")!=-1){
                skt = tmp1[2].replace(" チップセット","")
            }
            let chip = tmp1[3]
            if(tmp1.length>3 && tmp1[3].indexOf(" メモリタイプ")!=-1){
                chip = tmp1[3].replace(" メモリタイプ", "")
            }
            let mem = ""
            if(tmp1.length>4){
                mem = tmp1[4]
            }
            size.push(siz)
            //console.log(tmp1)
            soc.push(skt)
            chipset.push(chip)
            memory.push(mem)
        })*/
        var ur:Array<string|undefined> = [];
        $('.rkgBoxLink').each((i: Number, elem: cheerio.Element) => {
            ur.push($(elem).attr('href'))
        })
        for(let i=0;i<ur.length;i++){
            console.log(ur[i])
            try{
                const info: Array<Array<string>> = await INFO(ur[i])
                chipset.push(info[0][0])
                soc.push(info[0][1])
                size.push(info[0][2])
                memory.push(info[0][4])
            }catch (e){
                size.push("")
                chipset.push("")
                soc.push("")
                console.log(e)
            }
            

            await new Promise(resolve => setTimeout(resolve, 10))
        }
        for (let i = 0;i < name.length;i++){
            let cont: MB = {
                name: name[i],
                developer: developer[i],
                rank: rank[i],
                price: price[i],
                pricestr: pricestr[i],
                imgurl: imgurl[i],
                url: ur[i],
                chipset: chipset[i],
                socket: soc[i],
                size: size[i],
                memory: memory[i]
            }
            item.push(cont)
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        
    }
    
    return item
}

interface Power{
    name: string
    developer: string
    rank: string
    imgurl: string|undefined
    url: string|undefined
    size: string
    price: number
    pricestr: string
    watt: string
    certification: string
}

async function  PowerINFO(url:string|undefined): Promise<Array<Array<string>>> {
    let rows:Array<Array<string>> = []
    if(typeof url === "string"){    
        const res = await axios.get(url+"spec/?lid=spec_anchorlink_details#tab",{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
        }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let row: Array<string> = [];
        $('.tblBorderGray.mTop15 tr td').each((i: Number, elem: cheerio.Element) => {
            
            row.push($(elem).text())
        })
        rows.push(row)
        //console.table(rows)
    }
    return rows;
}


async function getPower (): Promise<Power[]> {
    const url: string = 'https://kakaku.com/pc/power-supply/ranking_0590/'
    let item: Array<Power> = []
    for(let i = 0;i < 8;i++){
        const url1 = url+"?page="+(i+1).toString()
        console.log(url1)
        const res = await axios.get(url+"?page="+(i+1).toString(),{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
            }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let name: Array<string> = []
        let developer: Array<string> = []
        let rank: Array<string> = []
        let pricestr: Array<string> = []
        let price: Array<number> = []
        let imgurl: Array<string|undefined> = []
        let watt: Array<string> = []
        let certification: Array<string> = []
        let size: Array<string> = []
        $('.rkgBoxNameItem').each((i: Number, elem: cheerio.Element) => {
            name.push($(elem).text())
        })
        $('.rkgBoxNameMaker').each((i: Number, elem: cheerio.Element) => {
            developer.push($(elem).text())
        })
        $('.num','.rkgBoxNum').each((i: Number, elem: cheerio.Element) => {
            rank.push($(elem).text())
        })
        $('.price').each((i: Number, elem: cheerio.Element) => {
            let iprice = 0
            pricestr.push($(elem).text())
            var str = $(elem).text()
            str = str.replace("¥","")
            str = str.replace(",","")
            iprice = Number(str)
            price.push(iprice)
        })
        $('.rkgItemImg img').each((i: Number, elem: cheerio.Element) => {
            var tmp = $(elem).attr('src')
            imgurl.push(tmp)
        })
        var ur:Array<string|undefined> = [];
        $('.rkgBoxLink').each((i: Number, elem: cheerio.Element) => {
            ur.push($(elem).attr('href'))
            //console.log(tmp)
        })
        for(let i=0;i<ur.length;i++){
            console.log(ur[i])
            try{
                const info: Array<Array<string>> = await PowerINFO(ur[i])
                size.push(info[0][0])
                watt.push(info[0][1])
                certification.push(info[0][2])
            }catch (e){
                size.push("")
                watt.push("")
                certification.push("")
                console.log(e)
            }
            

            await new Promise(resolve => setTimeout(resolve, 10))
        }
        for (let i = 0;i < name.length;i++){
            let cont: Power = {
                name: name[i],
                developer: developer[i],
                rank: rank[i],
                price: price[i],
                pricestr: pricestr[i],
                imgurl: imgurl[i],
                url: ur[i],
                //watt: "",
                //size: "",
                //certification: ""
                watt: watt[i],
                size: size[i],
                certification: certification[i]
            }
            item.push(cont)
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        
    }
    
    return item
}

interface Memory{
    name: string
    developer: string
    rank: string
    imgurl: string|undefined
    url: string|undefined
    price: number
    pricestr: string
    spec: string
    capacity: string
    speed: string
    module: string
}

async function getMemory (): Promise<Memory[]> {
    const url: string = 'https://kakaku.com/pc/pc-memory/ranking_0520/'
    let item: Array<Memory> = []
    for(let i = 0;i < 24;i++){
        const url1 = url+"?page="+(i+1).toString()
        console.log(url1)
        const res = await axios.get(url+"?page="+(i+1).toString(),{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
            }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let name: Array<string> = []
        let developer: Array<string> = []
        let rank: Array<string> = []
        let pricestr: Array<string> = []
        let price: Array<number> = []
        let imgurl: Array<string|undefined> = []
        let spec: Array<string> = []
        let capacity: Array<string> = []
        let speed: Array<string> = []
        let module: Array<string> = []
        $('.rkgBoxNameItem').each((i: Number, elem: cheerio.Element) => {
            name.push($(elem).text())
        })
        $('.rkgBoxNameMaker').each((i: Number, elem: cheerio.Element) => {
            developer.push($(elem).text())
        })
        $('.num','.rkgBoxNum').each((i: Number, elem: cheerio.Element) => {
            rank.push($(elem).text())
        })
        $('.price').each((i: Number, elem: cheerio.Element) => {
            let iprice = 0
            pricestr.push($(elem).text())
            var str = $(elem).text()
            str = str.replace("¥","")
            str = str.replace(",","")
            iprice = Number(str)
            price.push(iprice)
        })
        $('.rkgItemImg img').each((i: Number, elem: cheerio.Element) => {
            var tmp = $(elem).attr('src')
            imgurl.push(tmp)
        })
        var ur:Array<string|undefined> = [];
        $('.rkgBoxLink').each((i: Number, elem: cheerio.Element) => {
            ur.push($(elem).attr('href'))
            //console.log(tmp)
        })
        for(let i=0;i<ur.length;i++){
            console.log(ur[i])
            try{
                const info: Array<Array<string>> = await INFO(ur[i])
                spec.push(info[0][2] + " " + info[0][3])
                capacity.push(info[0][0] + "*" + info[0][1])
                speed.push(info[0][4])
                module.push(info[0][5])
            }catch (e){
                spec.push("")
                capacity.push("")
                speed.push("")
                module.push("")
                console.log(e)
            }
            

            await new Promise(resolve => setTimeout(resolve, 10))
        }
        for (let i = 0;i < name.length;i++){
            let cont: Memory = {
                name: name[i],
                developer: developer[i],
                rank: rank[i],
                price: price[i],
                pricestr: pricestr[i],
                imgurl: imgurl[i],
                url: ur[i],
                spec: spec[i],
                capacity: capacity[i],
                speed: speed[i],
                module: module[i]
            }
            item.push(cont)
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        
    }
    
    return item
}


interface CPUcooler{
    name: string
    developer: string
    rank: string
    imgurl: string|undefined
    url: string|undefined
    price: number
    pricestr: string
    socket: string
    form: string
    type: string
}

async function getCPUcooler (): Promise<CPUcooler[]> {
    const url: string = 'https://kakaku.com/pc/cpu-cooler/ranking_0512/'
    let item: Array<CPUcooler> = []
    for(let i = 0;i < 8;i++){
        const url1 = url+"?page="+(i+1).toString()
        console.log(url1)
        const res = await axios.get(url+"?page="+(i+1).toString(),{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
            }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let name: Array<string> = []
        let developer: Array<string> = []
        let rank: Array<string> = []
        let pricestr: Array<string> = []
        let price: Array<number> = []
        let imgurl: Array<string|undefined> = []
        let socket: Array<string> = []
        let form: Array<string> = []
        let type: Array<string> = []
        $('.rkgBoxNameItem').each((i: Number, elem: cheerio.Element) => {
            name.push($(elem).text())
        })
        $('.rkgBoxNameMaker').each((i: Number, elem: cheerio.Element) => {
            developer.push($(elem).text())
        })
        $('.num','.rkgBoxNum').each((i: Number, elem: cheerio.Element) => {
            rank.push($(elem).text())
        })
        $('.price').each((i: Number, elem: cheerio.Element) => {
            let iprice = 0
            pricestr.push($(elem).text())
            var str = $(elem).text()
            str = str.replace("¥","")
            str = str.replace(",","")
            iprice = Number(str)
            price.push(iprice)
        })
        $('.rkgItemImg img').each((i: Number, elem: cheerio.Element) => {
            var tmp = $(elem).attr('src')
            imgurl.push(tmp)
        })
        var ur:Array<string|undefined> = [];
        $('.rkgBoxLink').each((i: Number, elem: cheerio.Element) => {
            ur.push($(elem).attr('href'))
            //console.log(tmp)
        })
        for(let i=0;i<ur.length;i++){
            console.log(ur[i])
            try{
                const info: Array<Array<string>> = await INFO(ur[i])
                type.push(info[0][2])
                socket.push(info[0][0]+ " " + info[0][1])
                form.push(info[0][3])
            }catch (e){
                type.push("")
                socket.push("")
                form.push("")
                console.log(e)
            }
            

            await new Promise(resolve => setTimeout(resolve, 10))
        }
        for (let i = 0;i < name.length;i++){
            let cont: CPUcooler = {
                name: name[i],
                developer: developer[i],
                rank: rank[i],
                price: price[i],
                pricestr: pricestr[i],
                imgurl: imgurl[i],
                url: ur[i],
                type: type[i],
                socket: socket[i],
                form: form[i],
            }
            item.push(cont)
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        
    }
    
    return item
}

interface Storage{
    name: string
    developer: string
    rank: string
    imgurl: string|undefined
    url: string|undefined
    price: number
    pricestr: string
    capacity: string
    size: string
    connect: string
    type: string
    rdspeed: string
    wrtspeed: string
}

async function getStorage (): Promise<Storage[]> {
    const url: string = 'https://kakaku.com/pc/ssd/ranking_0537/'
    let item: Array<Storage> = []
    for(let i = 0;i < 18;i++){
        const url1 = url+"?page="+(i+1).toString()
        console.log(url1)
        const res = await axios.get(url+"?page="+(i+1).toString(),{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
            }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let name: Array<string> = []
        let developer: Array<string> = []
        let rank: Array<string> = []
        let pricestr: Array<string> = []
        let price: Array<number> = []
        let imgurl: Array<string|undefined> = []
        let size: Array<string> = []
        let capacity: Array<string> = []
        let connect: Array<string> = []
        let type: Array<string> = []
        let rdspeed: Array<string> = []
        let wrtspeed: Array<string> = []
        $('.rkgBoxNameItem').each((i: Number, elem: cheerio.Element) => {
            name.push($(elem).text())
        })
        $('.rkgBoxNameMaker').each((i: Number, elem: cheerio.Element) => {
            developer.push($(elem).text())
        })
        $('.num','.rkgBoxNum').each((i: Number, elem: cheerio.Element) => {
            rank.push($(elem).text())
        })
        $('.price').each((i: Number, elem: cheerio.Element) => {
            let iprice = 0
            pricestr.push($(elem).text())
            var str = $(elem).text()
            str = str.replace("¥","")
            str = str.replace(",","")
            iprice = Number(str)
            price.push(iprice)
        })
        $('.rkgItemImg img').each((i: Number, elem: cheerio.Element) => {
            var tmp = $(elem).attr('src')
            imgurl.push(tmp)
        })
        var ur:Array<string|undefined> = [];
        $('.rkgBoxLink').each((i: Number, elem: cheerio.Element) => {
            ur.push($(elem).attr('href'))
            //console.log(tmp)
        })
        for(let i=0;i<ur.length;i++){
            console.log(ur[i])
            try{
                const info: Array<Array<string>> = await INFO(ur[i])
                capacity.push(info[0][0])
                size.push(info[0][1])
                connect.push(info[0][2])
                type.push(info[0][3])
                rdspeed.push(info[0][8])
                wrtspeed.push(info[0][9])
            }catch (e){
                type.push("")
                capacity.push("")
                size.push("")
                connect.push("")
                rdspeed.push("")
                wrtspeed.push("")
                console.log(e)
            }
            

            await new Promise(resolve => setTimeout(resolve, 10))
        }
        for (let i = 0;i < name.length;i++){
            let cont: Storage = {
                name: name[i],
                developer: developer[i],
                rank: rank[i],
                price: price[i],
                pricestr: pricestr[i],
                imgurl: imgurl[i],
                url: ur[i],
                type: type[i],
                capacity: capacity[i],
                size: size[i],
                connect: connect[i],
                rdspeed:rdspeed[i],
                wrtspeed: wrtspeed[i]
            }
            item.push(cont)
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        
    }
    
    return item
}

interface StorageHDD{
    name: string
    developer: string
    rank: string
    imgurl: string|undefined
    url: string|undefined
    price: number
    pricestr: string
    capacity: string
    size: string
    connect: string
    type: string
    rdspeed: string
    wrtspeed: string
}

async function getStorageHDD (): Promise<StorageHDD[]> {
    const url: string = 'https://kakaku.com/pc/hdd-35inch/ranking_0530/'
    let item: Array<StorageHDD> = []
    for(let i = 0;i < 6;i++){
        const url1 = url+"?page="+(i+1).toString()
        console.log(url1)
        const res = await axios.get(url+"?page="+(i+1).toString(),{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
            }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let name: Array<string> = []
        let developer: Array<string> = []
        let rank: Array<string> = []
        let pricestr: Array<string> = []
        let price: Array<number> = []
        let imgurl: Array<string|undefined> = []
        let size: Array<string> = []
        let capacity: Array<string> = []
        let connect: Array<string> = []
        let type: Array<string> = []
        let rdspeed: Array<string> = []
        let wrtspeed: Array<string> = []
        $('.rkgBoxNameItem').each((i: Number, elem: cheerio.Element) => {
            name.push($(elem).text())
        })
        $('.rkgBoxNameMaker').each((i: Number, elem: cheerio.Element) => {
            developer.push($(elem).text())
        })
        $('.num','.rkgBoxNum').each((i: Number, elem: cheerio.Element) => {
            rank.push($(elem).text())
        })
        $('.price').each((i: Number, elem: cheerio.Element) => {
            let iprice = 0
            pricestr.push($(elem).text())
            var str = $(elem).text()
            str = str.replace("¥","")
            str = str.replace(",","")
            iprice = Number(str)
            price.push(iprice)
        })
        $('.rkgItemImg img').each((i: Number, elem: cheerio.Element) => {
            var tmp = $(elem).attr('src')
            imgurl.push(tmp)
        })
        var ur:Array<string|undefined> = [];
        $('.rkgBoxLink').each((i: Number, elem: cheerio.Element) => {
            ur.push($(elem).attr('href'))
            //console.log(tmp)
        })
        for(let i=0;i<ur.length;i++){
            console.log(ur[i])
            try{
                const info: Array<Array<string>> = await INFO(ur[i])
                capacity.push(info[0][0])
                size.push("3.5インチ")
                connect.push(info[0][3])
                type.push(info[0][2])
                rdspeed.push(info[0][1])
                wrtspeed.push("")
            }catch (e){
                type.push("")
                capacity.push("")
                size.push("")
                connect.push("")
                rdspeed.push("")
                wrtspeed.push("")
                console.log(e)
            }
            

            await new Promise(resolve => setTimeout(resolve, 10))
        }
        for (let i = 0;i < name.length;i++){
            let cont: StorageHDD = {
                name: name[i],
                developer: developer[i],
                rank: rank[i],
                price: price[i],
                pricestr: pricestr[i],
                imgurl: imgurl[i],
                url: ur[i],
                type: type[i],
                capacity: capacity[i],
                size: size[i],
                connect: connect[i],
                rdspeed:rdspeed[i],
                wrtspeed: wrtspeed[i]
            }
            item.push(cont)
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        
    }
    
    return item
}

interface Display{
    name: string
    developer: string
    rank: string
    imgurl: string|undefined
    url: string|undefined
    price: number
    pricestr: string
    size: string
    asp: string
    grea: string
    panel: string
    clear: string
    speed: string
    refreshrate: string
    port: string
}

async function getDisplay (): Promise<Display[]> {
    const url: string = 'https://kakaku.com/pc/lcd-monitor/ranking_0085/'
    let item: Array<Display> = []
    for(let i = 0;i < 29;i++){
        const url1 = url+"?page="+(i+1).toString()
        console.log(url1)
        const res = await axios.get(url+"?page="+(i+1).toString(),{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
            }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let name: Array<string> = []
        let developer: Array<string> = []
        let rank: Array<string> = []
        let pricestr: Array<string> = []
        let price: Array<number> = []
        let imgurl: Array<string|undefined> = []
        let size: Array<string> = []
        let asp: Array<string> = []
        let grea: Array<string> = []
        let panel: Array<string> = []
        let clear: Array<string> = []
        let port: Array<string> = []
        let speed: Array<string> = []
        let refreshrate: Array<string> = []
        $('.rkgBoxNameItem').each((i: Number, elem: cheerio.Element) => {
            name.push($(elem).text())
        })
        $('.rkgBoxNameMaker').each((i: Number, elem: cheerio.Element) => {
            developer.push($(elem).text())
        })
        $('.num','.rkgBoxNum').each((i: Number, elem: cheerio.Element) => {
            rank.push($(elem).text())
        })
        $('.price').each((i: Number, elem: cheerio.Element) => {
            let iprice = 0
            pricestr.push($(elem).text())
            var str = $(elem).text()
            str = str.replace("¥","")
            str = str.replace(",","")
            iprice = Number(str)
            price.push(iprice)
        })
        $('.rkgItemImg img').each((i: Number, elem: cheerio.Element) => {
            var tmp = $(elem).attr('src')
            imgurl.push(tmp)
        })
        var ur:Array<string|undefined> = [];
        $('.rkgBoxLink').each((i: Number, elem: cheerio.Element) => {
            ur.push($(elem).attr('href'))
            //console.log(tmp)
        })
        for(let i=0;i<ur.length;i++){
            console.log(ur[i])
            try{
                const info: Array<Array<string>> = await INFO(ur[i])
                asp.push(info[0][5])
                size.push(info[0][0])
                grea.push(info[0][6])
                panel.push(info[0][7])
                clear.push(info[0][8])
                port.push(info[0][28])
                speed.push(info[0][14])
                refreshrate.push(info[0][22])
                
            }catch (e){
                asp.push("")
                size.push("")
                grea.push("")
                panel.push("")
                clear.push("")
                port.push("")
                speed.push("")
                refreshrate.push("")
                console.log(e)
            }
            await new Promise(resolve => setTimeout(resolve, 10))
        }
        for (let i = 0;i < name.length;i++){
            let cont: Display = {
                name: name[i],
                developer: developer[i],
                rank: rank[i],
                price: price[i],
                pricestr: pricestr[i],
                imgurl: imgurl[i],
                url: ur[i],
                asp: asp[i],
                grea: grea[i],
                size: size[i],
                panel: panel[i],
                clear: clear[i],
                port: port[i],
                speed: speed[i],
                refreshrate: refreshrate[i]
            }
            item.push(cont)
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        
    }
    
    return item
}

interface Case{
    name: string
    developer: string
    rank: string
    imgurl: string|undefined
    url: string|undefined
    price: number
    pricestr: string
    powersize: string
    size: string
    sizenum: string
}

async function getCase (): Promise<Case[]> {
    const url: string = 'https://kakaku.com/pc/pc-case/ranking_0580/'
    let item: Array<Case> = []
    for(let i = 0;i < 13;i++){
        const url1 = url+"?page="+(i+1).toString()
        console.log(url1)
        const res = await axios.get(url+"?page="+(i+1).toString(),{
            responseType: 'arraybuffer',
            transformResponse: (data) => {
                const sjis = Buffer.from(data,'binary')
                const utf8 = iconv.decode(sjis,"SHIFT-JIS")
                return utf8
            }
        })
        const $: cheerio.Root = cheerio.load(res.data)
        let name: Array<string> = []
        let developer: Array<string> = []
        let rank: Array<string> = []
        let pricestr: Array<string> = []
        let price: Array<number> = []
        let imgurl: Array<string|undefined> = []
        let size: Array<string> = []
        let powersize: Array<string> = []
        let sizenum: Array<string> = []
        $('.rkgBoxNameItem').each((i: Number, elem: cheerio.Element) => {
            name.push($(elem).text())
        })
        $('.rkgBoxNameMaker').each((i: Number, elem: cheerio.Element) => {
            developer.push($(elem).text())
        })
        $('.num','.rkgBoxNum').each((i: Number, elem: cheerio.Element) => {
            rank.push($(elem).text())
        })
        $('.price').each((i: Number, elem: cheerio.Element) => {
            let iprice = 0
            pricestr.push($(elem).text())
            var str = $(elem).text()
            str = str.replace("¥","")
            str = str.replace(",","")
            iprice = Number(str)
            price.push(iprice)
        })
        $('.rkgItemImg img').each((i: Number, elem: cheerio.Element) => {
            var tmp = $(elem).attr('src')
            imgurl.push(tmp)
        })
        var ur:Array<string|undefined> = [];
        $('.rkgBoxLink').each((i: Number, elem: cheerio.Element) => {
            ur.push($(elem).attr('href'))
            //console.log(tmp)
        })
        for(let i=0;i<ur.length;i++){
            console.log(ur[i])
            try{
                const info: Array<Array<string>> = await INFO(ur[i])
                powersize.push(info[0][0])
                size.push(info[0][8])
                sizenum.push(info[0][31])
                
            }catch (e){
                powersize.push("")
                size.push("")
                sizenum.push("")
                console.log(e)
            }
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        for (let i = 0;i < name.length;i++){
            let cont: Case = {
                name: name[i],
                developer: developer[i],
                rank: rank[i],
                price: price[i],
                pricestr: pricestr[i],
                imgurl: imgurl[i],
                url: ur[i],
                powersize: powersize[i],
                size: size[i],
                sizenum: sizenum[i],
            }
            item.push(cont)
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
        
    }
    
    return item
}

async function makeJsonFile(){
    const filePathCPU = path.resolve(__dirname,"../data/CPU.json");
    let fileContents :Array<CPU> = []
    if(fs.existsSync(filePathCPU)){
        fileContents = JSON.parse(fs.readFileSync(filePathCPU, 'utf-8'));
    }
    fileContents = await getCPU();
    fs.writeFileSync(filePathCPU,JSON.stringify(fileContents));

    const filePathGPU = path.resolve(__dirname,"../data/GPU.json");
    let fileContentsG :Array<GPU> = []
    if(fs.existsSync(filePathGPU)){
        fileContentsG = JSON.parse(fs.readFileSync(filePathGPU, 'utf-8'));
    }
    fileContentsG = await getGPU();
    fs.writeFileSync(filePathGPU,JSON.stringify(fileContentsG));

    const filePathMem = path.resolve(__dirname,"../data/Memory.json");
    let fileContentMem :Array<Memory> = []
    if(fs.existsSync(filePathMem)){
        fileContentMem = JSON.parse(fs.readFileSync(filePathMem, 'utf-8'));
    }
    fileContentMem = await getMemory();
    fs.writeFileSync(filePathMem,JSON.stringify(fileContentMem));

    const filePathMB = path.resolve(__dirname,"../data/MB.json");
    let fileContentMB :Array<MB> = []
    if(fs.existsSync(filePathMB)){
        fileContentMB = JSON.parse(fs.readFileSync(filePathMB, 'utf-8'));
    }
    fileContentMB = await getMB();
    fs.writeFileSync(filePathMB,JSON.stringify(fileContentMB));

    const filePathPW = path.resolve(__dirname,"../data/PW.json");
    let fileContentPW :Array<Power> = []
    if(fs.existsSync(filePathPW)){
        fileContentPW = JSON.parse(fs.readFileSync(filePathPW, 'utf-8'));
    }
    fileContentPW = await getPower();
    fs.writeFileSync(filePathPW,JSON.stringify(fileContentPW));

    const filePathSSD = path.resolve(__dirname,"../data/SSD.json");
    let fileContentSSD :Array<Storage> = []
    if(fs.existsSync(filePathSSD)){
        fileContentSSD = JSON.parse(fs.readFileSync(filePathSSD, 'utf-8'));
    }
    fileContentSSD = await getStorage();
    fs.writeFileSync(filePathSSD,JSON.stringify(fileContentSSD));

    const filePathCool = path.resolve(__dirname,"../data/CPUCooler.json");
    let fileContentCool :Array<CPUcooler> = []
    if(fs.existsSync(filePathCool)){
        fileContentCool= JSON.parse(fs.readFileSync(filePathCool, 'utf-8'));
    }
    fileContentCool = await getCPUcooler();
    fs.writeFileSync(filePathCool,JSON.stringify(fileContentCool));

    const filePathHDD = path.resolve(__dirname,"../data/HDD.json");
    let fileContentHDD :Array<StorageHDD> = []
    if(fs.existsSync(filePathHDD)){
        fileContentHDD = JSON.parse(fs.readFileSync(filePathHDD, 'utf-8'));
    }
    fileContentHDD = await getStorageHDD();
    fs.writeFileSync(filePathHDD,JSON.stringify(fileContentHDD));

    const filePathDis = path.resolve(__dirname,"../data/Display.json");
    let fileContentDis :Array<Display> = []
    if(fs.existsSync(filePathDis)){
        fileContentDis = JSON.parse(fs.readFileSync(filePathDis, 'utf-8'));
    }
    fileContentDis = await getDisplay();
    fs.writeFileSync(filePathDis,JSON.stringify(fileContentDis));

    const filePathCase = path.resolve(__dirname,"../data/Case.json");
    let fileContentCase :Array<Case> = []
    if(fs.existsSync(filePathCase)){
        fileContentCase = JSON.parse(fs.readFileSync(filePathCase, 'utf-8'));
    }
    fileContentCase = await getCase();
    fs.writeFileSync(filePathCase,JSON.stringify(fileContentCase));
}

makeJsonFile();

/*const app: express.Express = express();

app.get('/', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const item: Array<CPU> = await getCPU();
    res.json(item);
});

app.listen(3000);*/