import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import PrivateFile from './privateFile.entity';

@Injectable()
export class PrivateFilesService {
  constructor(
    @InjectRepository(PrivateFile)
    private readonly privateFileRepository: Repository<PrivateFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPrivateFile(
    dataBuffer: Buffer,
    ownerId: number,
    filename: string,
  ) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
    const newFile = this.privateFileRepository.create({
      key: uploadResult.Key,
      owner: {
        id: ownerId,
      },
    });
    await this.privateFileRepository.save(newFile);
    return newFile;
  }
  async deletePrivateFile(ownerId: number, fileId: number) {
    const file = await this.privateFileRepository.findOne(
      { id: fileId },
      { relations: ['owner'] },
    );
    const permission = ownerId === file?.owner.id;
    if (!file) {
      throw new HttpException('file not exist', HttpStatus.NOT_FOUND);
    } else if (file && !permission) {
      throw new HttpException(
        'You not have permession for delete this file!',
        HttpStatus.BAD_GATEWAY,
      );
    }
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await this.privateFileRepository.delete(fileId);
  }
  public async getPrivateFile(fileId: number) {
    const s3 = new S3();
    const fileInfo = await this.privateFileRepository.findOne(
      { id: fileId },
      { relations: ['owner'] },
    );
    if (fileInfo) {
      const stream = await s3
        .getObject({
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
          Key: fileInfo.key,
        })
        .createReadStream();
      return {
        stream,
        info: fileInfo,
      };
    }
    throw new HttpException('file not exist', HttpStatus.NOT_FOUND);
  }
  public async generatePresignedUrl(key: string) {
    const s3 = new S3();
    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
    });
  }
}
