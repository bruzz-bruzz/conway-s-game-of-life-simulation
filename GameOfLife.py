import random
import time
# 1 = alive 0 = dead
class GameOfLife():
    def __init__(self):
        self.matrix = []
        for x in range(32):
            tmp = []
            for y in range(32):
                rand = random.randint(0,1)
                tmp.append(rand)
            self.matrix.append(tmp)
    def getAliveNeighbors(self,pos):
        res = 0
        #down
        if pos[0] < len(self.matrix) - 1:
            if self.matrix[pos[0] + 1][pos[1]] == 1:
                res += 1
        #up
        if pos[0] > 0:
            if self.matrix[pos[0] - 1][pos[1]] == 1:
                res += 1
        #right
        if pos[1] < len(self.matrix[0]) - 1:
            if self.matrix[pos[0]][pos[1] + 1] == 1:
                res += 1
        #left
        if pos[1] > 0:
            if self.matrix[pos[0]][pos[1] - 1] == 1:
                res += 1
        #bottom right
        if pos[0] < len(self.matrix) - 1 and pos[1] < len(self.matrix[0]) - 1:
            if self.matrix[pos[0] + 1][pos[1] + 1] == 1:
                res += 1
        #top left
        if pos[0] > 0 and pos[1] > 0:
            if self.matrix[pos[0] - 1][pos[1] - 1] == 1:
                res += 1
        #top right
        if pos[0] > 0 and pos[1] < len(self.matrix[0]) - 1:
            if self.matrix[pos[0] - 1][pos[1] + 1] == 1:
                res += 1
        #bottom left
        if pos[0] < len(self.matrix) - 1 and pos[1] > 0:
            if self.matrix[pos[0] + 1][pos[1] - 1] == 1:
                res += 1
        return res
    def determineFate(self,neighbors,state):
        if state == 1:
            if neighbors < 2 or neighbors > 3:
                return False
            return True
        else:
            if neighbors == 3:
                return True
            return False
    def visualize(self):
        res = ''
        for x in range(len(self.matrix)):
            tmp = ''
            for y in range(len(self.matrix[x])):
                tmp += '⬛' if self.matrix[x][y] == 0 else '⬜'
            res += tmp + '\n'
        return res
    def run(self):
        print('\033[2J')
        while True:
            matrix = []
            for x in range(len(self.matrix)):
                tmp = []
                for y in range(len(self.matrix[x])):
                    tmp.append(1 if self.determineFate(self.getAliveNeighbors([x,y]),self.matrix[x][y]) else 0)
                matrix.append(tmp)
            self.matrix = matrix
            print('\033[H', end='')
            print(self.visualize())
            time.sleep(0.2)
a = GameOfLife()
a.run()