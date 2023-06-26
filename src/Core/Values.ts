export default class Values
{
    static instance: Values;

    private constructor()
    {
        
    }

    static getInstance()
    {
        if (!this.instance)
            this.instance = new Values();
        return this.instance;
    }
}