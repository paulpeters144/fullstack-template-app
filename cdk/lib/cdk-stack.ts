import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

// eslint-disable-next-line no-restricted-syntax
export class CdkStack extends cdk.Stack {
  stage?: string;
  apiGateway: cdk.aws_apigateway.LambdaRestApi;
  apiLambda: cdk.aws_lambda.Function;
  ddbTable: cdk.aws_dynamodb.Table;
  s3Database: cdk.aws_s3.Bucket;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.stage = props?.tags?.stage;

    if (!this.stage) {
      throw new Error('stage not configured');
    }

    this._createDDBTable();

    this._createS3Database();

    this._createApiLambda();

    this._createApiGateway();
  }

  private _createDDBTable() {
    const tableName = 'ddb-table-' + this.stage;
    this.ddbTable = new dynamodb.Table(this, tableName, {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      tableName: tableName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
  }

  private _createApiLambda() {
    const apiLambdaName = 'api-lambda-' + this.stage;
    this.apiLambda = new lambda.Function(this, apiLambdaName, {
      functionName: apiLambdaName,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('../back/dist'),
      handler: 'lambda.handler',
      architecture: lambda.Architecture.ARM_64,
      memorySize: 512,
    });

    this.ddbTable.grantReadWriteData(this.apiLambda);

    this.apiLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        resources: [`${this.s3Database.bucketArn}/*`],
      }),
    );
  }

  private _createApiGateway() {
    const apiGatewayName = 'app-gateway-' + this.stage;
    this.apiGateway = new apigw.LambdaRestApi(this, apiGatewayName, {
      handler: this.apiLambda,
      restApiName: apiGatewayName,
      integrationOptions: { proxy: true },
      proxy: true,
    });
  }

  private _createS3Database() {
    const bucketName = 's3-bucket-name-' + this.stage;
    this.s3Database = new s3.Bucket(this, bucketName, {
      bucketName: bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.s3Database.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
        actions: ['s3:GetObject'],
        resources: [`${this.s3Database.bucketArn}/*`],
      }),
    );
  }
}
