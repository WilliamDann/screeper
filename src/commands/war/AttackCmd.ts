import Command from "../../framework/Command";
import WaveAttackProc from "../../processes/war/WaveAttackProc";

export default class AttackCmd extends Command
{
    stage  : string;
    target : string;

    init(): void {
        let sp      = this.flag.name.split(',');
        this.stage  = sp[0];
        this.target = sp[1];
    }

    run(): void {
        // create proc
        this.createProcess(new WaveAttackProc(Game.time+'', {
            stageRoom: this.stage,
            targetRoom: this.target
        }));

        // remove command
        this.remove();
    }
}