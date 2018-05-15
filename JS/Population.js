class Population
{
    constructor()
    {
        this.population = Array(POPULATION_SIZE);
        this.newPopulation = [];
        this.createPopulation();
    }
    createUnit(dna,winer,best)
    {
        //this.newPopulation[index] = new Unit(startPoint.x, startPoint.y, 10, dna);
        this.newPopulation.push(new Unit(startPoint.x, startPoint.y, 10, dna));

        if(winer)
            this.newPopulation[this.newPopulation.length-1].lastWinner = true;
        if(best)
            this.newPopulation[this.newPopulation.length-1].best = true;
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
        let fitnessSum = 0;
        /*
            Add fitness score to all units
        */
        for(let i = 0; i < this.population.length; i++)
        {
            let fitness = wx - this.population[i].distance;
            if(this.population[i].win)
                fitness -= this.population[i].ttc/60;
            else
                fitness -= TIME;
            this.population[i].fitness = fitness;
        }
        /*
            Get sum of all fitness
        */
        for(let i = 0; i < this.population.length; i++)
        {
            fitnessSum += this.population[i].fitness;
        }
        /*
            normalize fitness score
        */
        for(let i = 0; i < this.population.length; i++)
        {
            this.population[i].fitness /= fitnessSum;
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
        //this.population.forEach((e)=>{console.log(e.fitness);});
    }
    rewrite()
    {
        let x = this.population.length-1;

        this.newPopulation = [];

        while(this.newPopulation.length < Math.round(POPULATION_SIZE * 0.15)) // push 15% of old pop DNA to new
        {
            let dna = this.population[x].dna,
                win = this.population[x].win,
                best = !win;
            this.createUnit(dna, win, best);
            x--;
        }
    }
    select()
    {
        let i = 0, r, sum = 0;
        r = Math.random();
        while(sum < r)
        {
            sum += this.population[i].fitness;
            i++;
        }
        if(i == POPULATION_SIZE)
            --i;
        //console.log(r,sum, i);
        return i;
    }
    crossover()
    {
        while(this.newPopulation.length < POPULATION_SIZE) // 85% of new pop are  born from parents 
        {
            let randomUnits = [];
            let unit1, unit2;
            let sum = 0, r;
            let dna1A, dna1B, dna1C, dna1D,
                dna2A, dna2B, dna2C, dna2D;
            let dna1 = [], dna2 = [];

            unit1 = this.population[this.select()];
            unit2 = this.population[this.select()];

            //console.log(unit1, unit2);

            if(unit1 === unit2)
                continue;

            // slice DNA 1 and 2 and join like this 1-2-1-2   2-1-2-1
            let sliceSize = unit1.dna.length/4;

            dna1[0] = unit1.dna.slice(0, sliceSize);
            dna1[1] = unit1.dna.slice(sliceSize, 2*sliceSize);
            dna1[2] = unit1.dna.slice(2*sliceSize, 3*sliceSize);
            dna1[3] = unit1.dna.slice(3*sliceSize, 4*sliceSize);

            dna2[0] = unit1.dna.slice(0, sliceSize);
            dna2[1] = unit1.dna.slice(sliceSize, 2*sliceSize);
            dna2[2] = unit1.dna.slice(2*sliceSize, 3*sliceSize);
            dna2[3] = unit1.dna.slice(3*sliceSize, 4*sliceSize);

            this.createUnit((dna1[0] + dna2[1] + dna1[2] + dna2[3]).split(","));
            if(this.newPopulation.length < POPULATION_SIZE)
                this.createUnit((dna2[0] + dna1[1] + dna2[2] + dna1[3]).split(","));
        }
    }
    mutate()
    {
        let m = 0, r, lvl;
        for(let i =  Math.round(POPULATION_SIZE * 0.15); i < POPULATION_SIZE; i++)
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
        mutation = Math.round((m/POPULATION_SIZE)*100);
    }
    applyNewPopulation()
    {
        this.population = Object.assign([],this.newPopulation);
        this.newPopulation = [];
    }
}