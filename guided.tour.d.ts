import Shepherd from 'shepherd.js';
export declare type TourStep = Shepherd.Step.StepOptions;
export declare type TourStepButton = Shepherd.Step.StepOptionsButton;
export declare enum ITourEvent {
    'click' = "click",
    'pointerover' = "pointerover",
    'keyup' = "keyup",
    'added' = "added",
    'removed' = "removed"
}
export interface ITourEventOn {
    selector?: string;
    event?: keyof typeof ITourEvent;
}
export interface ITourEventOnOptions {
    timeBeforeShow?: number;
    interval?: number;
}
export interface ITourAbortOn extends ITourEventOn {
}
export interface ITourOptions extends Shepherd.Tour.TourOptions {
    abortOn?: ITourAbortOn[];
}
export interface ITourStepAttachToOptions extends ITourEventOnOptions {
    highlight?: boolean;
    retries?: number;
    skipIfNotFound?: boolean;
    else?: string;
    goBackTo?: string;
}
export interface ITourStepAdvanceOn extends ITourEventOn {
}
export interface ITourStepAdvanceOnOptions extends ITourEventOnOptions {
    jumpTo?: string;
    allowGoBack?: boolean;
}
export interface ITourStep extends TourStep {
    attachToOptions?: ITourStepAttachToOptions;
    advanceOnOptions?: ITourStepAdvanceOnOptions;
    advanceOn?: ITourStepAdvanceOn[] | ITourStepAdvanceOn | any;
    abortOn?: ITourAbortOn[];
}
declare abstract class TourButtonsActions {
    abstract next(): void;
    abstract back(): void;
    abstract cancel(): void;
    abstract finish(): void;
}
export declare class CovalentGuidedTour extends TourButtonsActions {
    private _destroyedEvent$;
    shepherdTour: Shepherd.Tour;
    stepOptions: ITourStep;
    constructor(stepOptions?: ITourStep);
    newTour(opts?: ITourOptions): void;
    back(): void;
    cancel(): void;
    next(): void;
    finish(): void;
    addSteps(steps: ITourStep[]): void;
    start(): void;
    protected _prepareTour(originalSteps: ITourStep[]): ITourStep[];
    private _bindEvent;
}
export {};
