import { TypeParametersCtx } from "java-parser";
import { performance } from "perf_hooks";

const { parse, BaseJavaCstVisitorWithDefaults } = require('java-parser');

const javaText = `
public class HelloWorldExample{
  
  private int asador = 0;
  public long puppa = 0;
  public char lee = 0;
  public String ops;
  public MyClass powa = null;
  private Date date;
  protected boolean lol = null;
  	
  public static void main(String args[]){
    System.out.println("Hello World !");
    int pippa = 0;	
    stateOwner.addStateListener(
      oldState -> System.out.println("State changed")
    );
  }
}
`;

class MyCollector extends BaseJavaCstVisitorWithDefaults {
	constructor() {
		super();
		this.customResult = [];
		this.classFields = new Map();
		this.evaluatedClassName = "";
		this.validateVisitor();
	}

	/**
	 * Invoked when visiting a Java Class (no interfaces nor enum)
	 * @param ctx 
	 */
	normalClassDeclaration(ctx: any) {
		this.evaluatedClassName = ctx.typeIdentifier[0].children.Identifier[0].image;
		super.normalClassDeclaration(ctx);
	}

	/**
	 * Invoked when visiting a field class
	 */
	fieldDeclaration(ctx: any) {
		let fieldName = ctx.variableDeclaratorList[0].children.variableDeclarator[0].children.variableDeclaratorId[0].children.Identifier[0].image;
		let fieldType = "Any"
		if (ctx.unannType[0].children.unannReferenceType) {
			let identifier = ctx.unannType[0].children.unannReferenceType[0].children.unannClassOrInterfaceType[0].children.unannClassType[0].children.Identifier;
			fieldType = ctx.unannType[0].children.unannReferenceType[0].children.unannClassOrInterfaceType[0].children.unannClassType[0].children.Identifier[0].image;
		} else if (ctx.unannType[0].children.unannPrimitiveTypeWithOptionalDimsSuffix[0].children.unannPrimitiveType[0].children.numericType) {
			fieldType = "number";
		} else if (ctx.unannType[0].children.unannPrimitiveTypeWithOptionalDimsSuffix[0]) {
			fieldType = "boolean";
		}
		this.classFields.set(fieldName, fieldType);
		super.fieldDeclaration(ctx)
	}

}

var t0 = performance.now()

const cst = parse(javaText);
// explore the CST

const myCollector = new MyCollector();
// The CST result from the previous code snippet
myCollector.visit(cst);

console.log("=== CLASSNAME ===");
console.log(myCollector.evaluatedClassName);
console.log("=== FIELDS ===");
for (let entry of myCollector.classFields.entries()) {
    console.log(entry[0], entry[1]);
}

var t1 = performance.now()
console.log("Completed in " + (t1 - t0) + " milliseconds.")
