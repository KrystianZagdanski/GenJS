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
        /*
            Add fitness score to all units
        */
        for(let i = 0; i < this.population.length; i++)
        {
            let fitness = 0;
            let score = Distance(startPoint, target);
            fitness += (score - this.population[i].distance);
            fitness += (score - this.population[i].bestDistance)*0.5;
            fitness -= this.population[i].ttc;
            console.log(this.population[i].ttc);
            if(fitness < 0)
                fitness = 0;

            this.population[i].fitness = fitness;
        }
    }
    sort()
    {
        this.population.sort(function(a, b){
            if (a.fitness > b.fitness)
                return -1;
            else if (a.fitness < b.fitness)
                return 1;
            else
                return 0;
        });
        //this.population.forEach((e)=>{console.log(e.fitness);});
    }
    rewrite()
    {
        let x = 0;
        this.newPopulation = [];

        while(this.newPopulation.length < Math.round(POPULATION_SIZE * 0.15)) // push 15% of old pop DNA to new
        {
            let dna = this.population[x].dna,
                win = this.population[x].win,
                best = !win;
            this.createUnit(dna, win, best);
            x++;
        }
    }
    select()
    {
        let i = 0, r;  
        let sum = this.population[0].fitness;
        let fitnessSum = 0;
        for(let i = 0; i < this.population.length; i++)
        {
            fitnessSum += this.population[i].fitness;
        }

        r = Rand(0, fitnessSum+1);

        while(sum < r && i+1 < POPULATION_SIZE)
        {
            sum += this.population[++i].fitness;
        }
        //console.log(fitnessSum, sum);
        return i;
        
    }
    crossover()
    {
        while(this.newPopulation.length < POPULATION_SIZE) // 85% of new pop are born from parents 
        {
            let randomUnits = [];
            let unit1, unit2;
            let dna1 = [], dna2 = [];

            unit1 = this.population[this.select()];
            unit2 = this.population[this.select()];

            //console.log(unit1.fitness, unit2.fitness, "max:"+this.population[0].fitness +" min:"+this.population[POPULATION_SIZE-1].fitness);

            if(unit1 === unit2)
                continue;

            let crossPoint = Rand(10, unit1.dna.length-10);
            dna1[0] = unit1.dna.slice(0,crossPoint);
            dna1[1] = unit2.dna.slice(crossPoint,unit1.dna.length);

            dna2[0] = unit2.dna.slice(0,crossPoint);
            dna2[1] = unit1.dna.slice(crossPoint,unit1.dna.length);

            this.createUnit((dna1[0] + [,] + dna1[1]).split(","));
            if(this.newPopulation.length < POPULATION_SIZE)
                this.createUnit((dna2[0] +[,]+ dna2[1]).split(","));
        }
    }
    mutate()
    {
        let m = 0, r, lvl;
        for(let i = 0; i < POPULATION_SIZE; i++)
        {
            r = Math.random();
            if(r > 0.92) // around 8% of new pop change something in DNA
            {
                lvl = Rand(5,15); // change 10 - 20 parts of DNA
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