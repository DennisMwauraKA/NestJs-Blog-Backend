import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { from } from 'form-data';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('appConfig.mailhost'),
          secure: false,
          port: 2525,
          auth: {
            user: config.get('appConfig.smtpUsername'),
            pass: config.get('appConfig.smtpPassword'),
          },
        },

        default: {
          from: `My Blog <No reply@DennisBlog.com>`,
        },


        template:{
          dir:join(__dirname,'templates'),
          adapter:new EjsAdapter(),
          options:{
            strict:false
          }
        }
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
