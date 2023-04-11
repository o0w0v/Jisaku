from django.shortcuts import render
import json
# Create your views here.
from django.http import HttpResponse
from collections import defaultdict

def Jisaku(request):
    print(request)
    data = []
    CPU = open('../data/CPU.json','r',encoding='utf-8')
    CPUcooler = open('../data/CPUCooler.json','r',encoding='utf-8')
    MB = open('../data/MB.json','r',encoding='utf-8')
    GPU = open('../data/GPU.json','r',encoding='utf-8')
    Memory = open('../data/Memory.json','r',encoding='utf-8')
    SSD = open('../data/SSD.json','r',encoding='utf-8')
    HDD = open('../data/HDD.json','r',encoding='utf-8')
    PW = open('../data/PW.json','r',encoding='utf-8')
    Case = open('../data/Case.json','r',encoding='utf-8')
    Display = open('../data/Display.json','r',encoding='utf-8')
    dataCPU = json.load(CPU)
    dataCPUcooler = json.load(CPUcooler)
    dataMB = json.load(MB)
    dataGPU = json.load(GPU)
    dataMemory = json.load(Memory)
    dataSSD = json.load(SSD)
    dataHDD = json.load(HDD)
    dataPW = json.load(PW)
    dataCase = json.load(Case)
    dataDisplay = json.load(Display)
    data.append(dataCPU)
    data.append(dataCPUcooler)
    data.append(dataMB)
    data.append(dataGPU)
    data.append(dataMemory)
    data.append(dataSSD)
    data.append(dataHDD)
    data.append(dataPW)
    data.append(dataCase)
    data.append(dataDisplay)

    return render(request,'JisakuPC.html',{'data_json':json.dumps(data)})

def Usage(request):
    print(request)
    return render(request,"Usage.html")