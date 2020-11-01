class Population
{
    constructor()
    {
        this.units = Array(POPULATION_SIZE);
        this.newUnits = [];
        this.createPopulation();
    }
    /*
        Create single unit with specify dna
    */
    createUnit(dna,winer,best)
    {
        this.newUnits.push(new Unit(startPoint.x, startPoint.y, 10, dna));

        if(winer)
            this.newUnits[this.newUnits.length-1].lastWinner = true;
        if(best)
            this.newUnits[this.newUnits.length-1].best = true;
    }
    /*
        Create whole new population with random dna
    */
    createPopulation()
    {
        for(let i = 0; i < POPULATION_SIZE; i++)
        {
            this.units[i] = new Unit(startPoint.x, startPoint.y, 10);
            alive += 1; // alive units counter
        }
    }
    /*
        Calculate and add fitness score to all units
    */
    calculateFitness()
    {
        for(let i = 0; i < this.units.length; i++)
        {
            let fitness = 0;
            let score = Distance(startPoint, target);

            fitness += (score - this.units[i].distance);
            fitness += (score - this.units[i].bestDistance)*0.5;
            if(this.units[i].win)
                fitness += TIME - this.units[i].ttc*0.3;

            if(fitness < 0)
                fitness = 0;

            this.units[i].fitness = fitness;
        }
    }
    /*
        Sort units from best to worst depends on fitness
    */
    sort()
    {
        this.units.sort(function(a, b){
            if (a.fitness > b.fitness)
                return -1;
            else if (a.fitness < b.fitness)
                return 1;
            else
                return 0;
        });
    }
    /* 
        Rewrite best 15% of population
    */
    rewrite()
    {
        let x = 0;
        this.newUnits = [];

        while(this.newUnits.length < Math.round(POPULATION_SIZE * 0.15))
        {
            let dna = this.units[x].dna,
                win = this.units[x].win,
                best = !win;
            this.createUnit(dna, win, best);
            x++;
        }
    }
    /* 
        Select and return index of Unit
    */
    select()
    {
        // let i = 0, r;  
        // let sum = this.units[0].fitness;
        // let fitnessSum = 0;
        // for(let i = 0; i < this.units.length; i++)
        // {
        //     fitnessSum += this.units[i].fitness;
        // }

        // r = Rand(0, fitnessSum+1);

        // while(sum < r && i+1 < POPULATION_SIZE)
        // {
        //     sum += this.units[++i].fitness;
        // }
        // return i;

        let unitIndex = 0;
        let fitnessSum = 0;
        // calculate max fitness
        for(let a = 0; a < this.units.length; a++)
        {
            fitnessSum += this.units[a].fitness;
        }

        while(unitIndex < this.units.length-2)
        {
            // select random weighted index
            if(Rand(0, fitnessSum) < this.units[unitIndex].fitness)
            {
                return unitIndex;
            }

            fitnessSum -= this.units[unitIndex++].fitness;
        }
        return unitIndex;
        
    }
    /* 
        Create new Units from selected parents
    */
    crossover()
    {
        while(this.newUnits.length < POPULATION_SIZE)
        {
            let randomUnits = [];
            let unit1, unit2;
            let dna1 = [], dna2 = [];

            let s1 = this.select(), s2 = this.select();
            unit1 = this.units[s1];
            unit2 = this.units[s2];

            if(unit1 === unit2)
                continue;
            
            let crossPoint = Rand(10, unit1.dna.length-10);
            dna1[0] = unit1.dna.slice(0,crossPoint);
            dna1[1] = unit2.dna.slice(crossPoint,unit1.dna.length);

            dna2[0] = unit2.dna.slice(0,crossPoint);
            dna2[1] = unit1.dna.slice(crossPoint,unit1.dna.length);

            this.createUnit((dna1[0] + [,] + dna1[1]).split(","));
            if(this.newUnits.length < POPULATION_SIZE)
                this.createUnit((dna2[0] +[,]+ dna2[1]).split(","));
        }
    }
    /* 
        Mutate fiew Units in new population
    */
    mutate()
    {
        let m = 0, r, lvl;
        for(let i = 0; i < POPULATION_SIZE; i++)
        {
            r = Math.random();
            if(r > 0.92)
            {
                lvl = Rand(1,5); // change 1 - 4 parts of DNA
                while(0 < lvl)
                {
                    this.newUnits[i].dna[Rand(0,this.newUnits[i].dna.length)] = Rand(-1,2);
                    lvl--;
                }
                m++; // mutation rate couter
            }
        }
        mutation = Math.round((m/POPULATION_SIZE)*100);
    }
    
    applyNewPopulation()
    {
        this.units = Object.assign([],this.newUnits);
        this.newUnits = [];
    }
}