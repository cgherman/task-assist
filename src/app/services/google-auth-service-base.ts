import { AuthServiceBase } from "./auth-service-base";
import { IGoogleAuthService } from "./igoogle-auth-service";

export abstract class GoogleAuthServiceBase extends AuthServiceBase implements IGoogleAuthService {
    public abstract set api_key(newValue: string);
    public abstract set client_id(newValue: string);
    public abstract set scope(newValue: string);
    public abstract set discoveryDocs(newValue: string[]);    
}