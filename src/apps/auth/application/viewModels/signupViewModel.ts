import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import SignupState, { Stage } from "../states/signupState";
import AuthRepository from "../../infrastructure/repositories/authRepository";
import { Role } from "../../domain/models/profile";
import Organization from "@/apps/core/domain/models/organization";
import OrganizationRepository from "@/apps/core/infrastructure/repositories/organizationRepository";
import InvitationRepository from "../../infrastructure/repositories/invitationRepository";



export default class SignupViewModel extends AsyncViewModel<SignupState>{


    private authRepository = new AuthRepository();
    private orgRepository = new OrganizationRepository();
    private invitationRepositoy = new InvitationRepository();

    public async onInit(): Promise<void> {
        await super.onInit();
        if(!this.state.adminMode){
            this.state.invitation = await this.invitationRepositoy.getById(this.state.invitationId!);
            this.state.organizationId = this.state.invitation.orgId;
        }
    }

    async signup(){

        await this.asyncCall(
            async () => {
                await this.state.form.validate(true);
                await this.authRepository.signup(
                    this.state.form.email.getValue()!,
                    this.state.form.password.getValue()!
                )
                if(this.state.organizationId === undefined){
                    this.state.stage = Stage.organization;
                }
                else{
                    await this.completeSignup();
                }
            }
        );

    }

    async createOrganization(){
        await this.asyncCall(
            async () => {
                await this.state.orgForm.validate(true);
                const org = new Organization(this.state.orgForm.name.getValue()!);
                await this.orgRepository.create(org);
                this.state.organizationId = org.id;
                await this.completeSignup();
            }
        )
    }

    private async completeSignup(){
        await this.authRepository.completeProfile(
            this.state.form.email.getValue()!,
            this.state.form.name.getValue()!,
            this.state.invitation?.role ?? Role.admin,
            this.state.organizationId!
        );
        this.state.stage = Stage.done;
    } 

}