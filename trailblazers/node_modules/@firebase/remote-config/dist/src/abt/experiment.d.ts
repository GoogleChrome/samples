import { FirebaseExperimentDescription } from '../public_types';
import { RemoteConfig } from '../remote_config';
export declare class Experiment {
    private storage;
    private logger;
    private analyticsProvider;
    constructor(rc: RemoteConfig);
    updateActiveExperiments(latestExperiments: FirebaseExperimentDescription[]): Promise<void>;
    private createExperimentInfoMap;
    private addActiveExperiments;
    private removeInactiveExperiments;
    private addExperimentToAnalytics;
}
