import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import Shepherd from 'shepherd.js';
import { Observable } from 'rxjs';
import { CovalentGuidedTour, ITourStep, ITourOptions } from './guided.tour';
export interface IGuidedTour extends ITourOptions {
    steps: IGuidedTourStep[];
    finishButtonText?: string;
}
export interface IGuidedTourStep extends ITourStep {
    routing?: {
        route: string;
        extras?: NavigationExtras;
    };
}
/**
 *  Router enabled Shepherd tour
 */
export declare enum TourEvents {
    complete = "complete",
    cancel = "cancel",
    hide = "hide",
    show = "show",
    start = "start",
    active = "active",
    inactive = "inactive"
}
export interface IGuidedTourEvent {
    step: any;
    previous: any;
    tour: any;
}
export declare class CovalentGuidedTourService extends CovalentGuidedTour {
    private _router;
    private _route;
    private _httpClient;
    private _toursMap;
    private _tourStepURLs;
    constructor(_router: Router, _route: ActivatedRoute, _httpClient: HttpClient);
    tourEvent$(str: TourEvents): Observable<IGuidedTourEvent>;
    registerTour(tourName: string, tour: IGuidedTour | string): Promise<void>;
    startTour(tourName: string): Shepherd.Tour;
    initializeOnQueryParams(queryParam?: string): Observable<ParamMap>;
    setNextBtnDisability(stepId: string, isDisabled: boolean): void;
    private _loadTour;
    private _getTour;
    private _configureRoutesForSteps;
}
