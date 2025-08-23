import { ACCESS_KEY_ID, ACCESS_KEY_SECRET, ACCOUNT_ID } from '$env/static/private';
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
	type S3ClientConfig
} from '@aws-sdk/client-s3';

export class R2Storage {
	private static instance: R2Storage | null = null;
	private s3Client: S3Client;
	private readonly bucketName = 'wcif-history';

	private constructor() {
		this.s3Client = this.initS3Worker();
	}

	public static getInstance(): R2Storage {
		if (!R2Storage.instance) {
			R2Storage.instance = new R2Storage();
		}
		return R2Storage.instance;
	}

	private initS3Worker(): S3Client {
		console.log(ACCESS_KEY_ID, ACCESS_KEY_SECRET, ACCOUNT_ID);

		if (!ACCESS_KEY_ID || !ACCESS_KEY_SECRET || !ACCOUNT_ID) {
			throw new Error(
				'Missing environment variables: ACCESS_KEY_ID, ACCESS_KEY_SECRET, or ACCOUNT_ID'
			);
		}

		const s3ClientConfig: S3ClientConfig = {
			endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
			region: 'auto',
			credentials: {
				accessKeyId: ACCESS_KEY_ID!,
				secretAccessKey: ACCESS_KEY_SECRET!
			},
			forcePathStyle: true
		};

		return new S3Client(s3ClientConfig);
	}

	public async putContent(key: string, value: string): Promise<void> {
		const putCommand = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
			Body: value
		});

		try {
			await this.s3Client.send(putCommand);
		} catch (error) {
			throw new Error(`Failed to upload content to S3: ${error}`);
		}
	}

	public async getContent(key: string): Promise<string> {
		const getCommand = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: key
		});

		try {
			const response = await this.s3Client.send(getCommand);
			if (!response.Body) {
				throw new Error('Object body is empty.');
			}
			return response.Body.transformToString();
		} catch (error) {
			throw new Error(`Failed to get string from S3: ${error}`);
		}
	}

	public static generateKey(compId: string, userid: number, date: Date): string {
		return `${compId}-${userid}-${date.toISOString()}`;
	}
}
