import { AuthServiceBase } from "./auth-service-base";
import { IGoogleAuthService } from "./igoogle-auth-service";

export abstract class GoogleAuthServiceBase extends AuthServiceBase implements IGoogleAuthService {
    abstract set api_key(newValue: string);
    abstract set client_id(newValue: string);
    abstract set scope(newValue: string);
    abstract set discoveryDocs(newValue: string[]);    
}