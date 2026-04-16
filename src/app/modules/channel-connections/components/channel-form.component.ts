import {
  Component,
  input,
  output,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconComponent } from '../../../shared/components/icon.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CreateChannelConnectionRequestDto,
  UpdateChannelConnectionRequest,
  ChannelConnectionResponseDto,
  ChannelType,
  ChannelProvider,
  CHANNEL_TYPE_DISPLAY_NAMES,
  CHANNEL_PROVIDER_DISPLAY_NAMES,
} from '../models';
import { ConfigService } from '../../../core/config/config.service';

@Component({
  selector: 'app-channel-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  styleUrl: './channel-form.component.css',
  templateUrl: './channel-form.component.html',
})
export class ChannelFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly config = inject(ConfigService);

  readonly submit = output<CreateChannelConnectionRequestDto>();
  readonly submitUpdate = output<UpdateChannelConnectionRequest>();
  readonly cancel = output<void>();
  readonly isSubmitting = input(false);
  readonly companyId = input<number>(0);
  readonly branchId = input<number | null>(null);
  /** Si se proporciona, el formulario entra en modo edición. */
  readonly channel = input<ChannelConnectionResponseDto | null>(null);

  form!: FormGroup;
  readonly channelTypes = [ChannelType.TELEGRAM, ChannelType.WHATSAPP];
  readonly providers = [ChannelProvider.TELEGRAM, ChannelProvider.META];

  isAutoWebhookDevMode(): boolean {
    return this.config.isTelegramAutoWebhookDevEnabled();
  }

  isEditMode(): boolean {
    return this.channel() !== null;
  }

  ngOnInit(): void {
    const ch = this.channel();
    this.form = this.fb.group({
      channelType: [ch?.channelType ?? ChannelType.TELEGRAM, Validators.required],
      provider: [ch?.provider ?? ChannelProvider.TELEGRAM, Validators.required],
      externalAccountId: [ch?.externalAccountId ?? ''],
      accessToken: [''],
      webhookBaseUrl: [''],
      webhookVerifyToken: [''],
    });

    if (!this.isEditMode()) {
      this.form.get('accessToken')?.setValidators(Validators.required);
      this.form.get('webhookVerifyToken')?.setValidators(Validators.required);
    }

    this.form.get('channelType')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateValidators();
      });

    this.updateValidators();
  }

  private updateValidators(): void {
    const webhookCtrl = this.form.get('webhookBaseUrl');
    const accountCtrl = this.form.get('externalAccountId');

    if (!this.isEditMode()) {
      if (this.isTelegram()) {
        if (this.isAutoWebhookDevMode()) {
          webhookCtrl?.clearValidators();
        } else {
          webhookCtrl?.setValidators([Validators.required]);
        }
        accountCtrl?.clearValidators();
      } else {
        webhookCtrl?.clearValidators();
        accountCtrl?.setValidators([Validators.required]);
      }
    } else {
      // Modo edición: todos opcionales
      webhookCtrl?.clearValidators();
      accountCtrl?.clearValidators();
    }

    webhookCtrl?.updateValueAndValidity();
    accountCtrl?.updateValueAndValidity();
  }

  isTelegram(): boolean {
    const ch = this.channel();
    if (ch) return ch.channelType === ChannelType.TELEGRAM;
    return this.form?.get('channelType')?.value === ChannelType.TELEGRAM;
  }

  getChannelTypeLabel(type: ChannelType): string {
    return CHANNEL_TYPE_DISPLAY_NAMES[type] ?? type;
  }

  getProviderLabel(prov: ChannelProvider): string {
    return CHANNEL_PROVIDER_DISPLAY_NAMES[prov] ?? prov;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode()) {
      const value = this.form.value;
      const req: UpdateChannelConnectionRequest = {};
      if (value.accessToken?.trim()) req.accessToken = value.accessToken.trim();
      if (value.webhookVerifyToken?.trim()) req.webhookVerifyToken = value.webhookVerifyToken.trim();
      if (value.webhookBaseUrl?.trim()) req.webhookBaseUrl = value.webhookBaseUrl.trim();
      this.submitUpdate.emit(req);
    } else {
      const value = this.form.value;
      const request: CreateChannelConnectionRequestDto = {
        ...value,
        companyId: this.companyId(),
        branchId: this.branchId() ?? undefined,
        externalAccountId: value.externalAccountId || value.accessToken,
      };
      this.submit.emit(request);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
