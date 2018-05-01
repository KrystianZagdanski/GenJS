class Population
{
    constructor()
    {
        this.population = Array(POPULATION_SIZE);
        this.newPopulation = Array(POPULATION_SIZE);
        this.createPopulation();
    }
    createUnit(dna,index,winer,best)
    {
        this.newPopulation[index] = new Unit(startPoint.x, startPoint.y, 10, dna);
        if(winer)
            this.newPopulation[index].lastWinner = true;
        if(best)
            this.newPopulation[index].best = true;
    }

    createPopulation()
    {
        for(var i = 0; i < POPULATION_SIZE; i++)
        {
            this.population[i] = new Unit(startPoint.x, startPoint.y, 10);
            alive += 1;
        }
    }
    calculateFitness()
    {
        for(let i = 0; i < this.population.length; i++)
        {
            let fitness = wx - this.population[i].distance;
            if(this.population[i].win)
                fitness -= ttc;
            else
                fitness -= 2*ttc;
        
            this.population[i].fitness = fitness;
        }
    }
    sort()
    {
        this.population.sort(function(a, b){
            if (a.fitness > b.fitness)
                return 1;
            else if (a.fitness < b.fitness)
                return -1;
            else
                return 0;
        });
        console.log("Populatio after sort:",this.population.forEach((e)=>{e.fitness}));
    }
    rewrite()
    {
        let x = 0;
        while(this.newPopulation.length < Math.round(POPULATION_SIZE * 0.15)) // push 15% of old pop DNA to new
        {
            let dna = population[x].dna,
                win = population[x].win,
                best = !win;
            this.newPopulation.push(this.createUnit(dna, x, win, best));
            x++;
        }
    }
    born()
    {
        while(this.newPopulation.length < POPULATION_SIZE) // 85% of new pop are  born from parents 
        {
            let unit1, unit2;
            let dna1A, dna1B, dna1C, dna1D,
                dna2A, dna2B, dna2C, dna2D;
            let dna1 = [], dna2 = [];
            
            unit1 = this.population[Rand(0, POPULATION_SIZE+1)];
            unit2 = this.population[Rand(0, POPULATION_SIZE+1)];

            if(unit1 === unit2)
                continue;

            // slice DNA 1 and 2 and join like this 1-2-1-2   2-1-2-1
            let sliceSize = unit1.length/4;

            dna1[0] = unit1.dna.slice(0, sliceSize);
            dna1[1] = unit1.dna.slice(sliceSize, 2*sliceSize);
            dna1[2] = unit1.dna.slice(2*sliceSize, 3*sliceSize);
            dna1[3] = unit1.dna.slice(3*sliceSize, 4*sliceSize);

            dna2[0] = unit1.dna.slice(0, sliceSize);
            dna2[1] = unit1.dna.slice(sliceSize, 2*sliceSize);
            dna2[2] = unit1.dna.slice(2*sliceSize, 3*sliceSize);
            dna2[3] = unit1.dna.slice(3*sliceSize, 4*sliceSize);

            unit1 = this.createUnit(dan1[0] + dna2[1] + dna1[2] + dna2[3]);
            unit2 = this.createUnit(dan2[0] + dna1[1] + dna2[2] + dna1[3]);
           
            console.log("born() unit1:",unit1,"\nunit2:",unit2);
           
            this.newPopulation.push(unit1);
            if(this.newPopulation.length < POPULATION_SIZE)
                this.newPopulation.push(unit2);
        }
    }
    mutate()
    {
        let m = 0, r, lvl;
        for(let i = 0; i < this.POPULATION_SIZE; i++)
        {
            r = Math.random();
            if(r > 0.92) // around 8% of new pop change something in DNA
            {
                lvl = Rand(10,30); // change 10 - 30 parts of DNA
                while(0 < lvl)
                {
                    this.newPopulation[i].dna[Rand(0,this.newPopulation[i].dna.length)] = Rand(-1,2);
                    lvl--;
                }
                m++;
            }
        }
    }
}