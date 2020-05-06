import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import Shepherd from 'shepherd.js';
import { Observable } from 'rxjs';
import { CovalentGuidedTour, ITourStep, ITourOptions } from './guided.tour';
export interface IGuidedTour extends ITourOptions {
    steps: IGuidedTourStep[];
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
export declare class CovalentGuidedTourService extends CovalentGuidedTour {
    private _router;
    private _route;
    private _httpClient;
    private _toursMap;
    constructor(_router: Router, _route: ActivatedRoute, _httpClient: HttpClient);
    registerTour(tourName: string, tour: IGuidedTour | string): Promise<void>;
    startTour(tourName: string): Shepherd.Tour;
    initializeOnQueryParams(queryParam?: string): Observable<ParamMap>;
    private _loadTour;
    private _getTour;
    private _configureRoutesForSteps;
}
