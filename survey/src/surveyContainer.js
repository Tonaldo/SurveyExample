import { Container, Box, Button, Spinner, Textarea, Alert, AlertIcon } from "@chakra-ui/react"
import { CheckIcon } from "@chakra-ui/icons"
import axios from 'axios'
import _ from 'lodash';
import React from 'react'


export default class SurveyContainer extends React.Component {
    state = {
        survey: {},
        isLoading: true,
        surveyAnswer: {},
        isSubmiting: false
    
    }
    async componentDidMount() {
            this.setState({ isLoading: true }, async () => {
                const fetchSurvey = await axios.get('http://localhost:8080/survey/' )
                if (!_.isEmpty(fetchSurvey.data))  {
                    this.setState({survey: fetchSurvey.data.survey }, () => {
                        this.setState({isLoading: false})
                    })
                }
            })
        }

    onSurveyAnswerChange = (answer, value) => {
        const state = {...this.state.surveyAnswer, [answer]: value}
        this.setState({surveyAnswer: state})
    }

    generateSurveyQuestions = (name, type, rangemin, rangemax) => {
        let surveyQuestionOptions = [];
        let amount = rangemax +1 - rangemin
        if(type === "nps") {
            _.times(amount, (index) => {
                surveyQuestionOptions.push(<Button style={{margin: "2px"}} onClick={() => this.onSurveyAnswerChange(name, index)} size="md">{index}</Button>);
            });
        }
        if(type === "textarea") {
            surveyQuestionOptions.push(<Textarea onChange={(e) => {this.onSurveyAnswerChange(name, e.target.value)}}></Textarea>)
        }      
       
       return surveyQuestionOptions; 
    }

    submitSurvey = async () => {
        this.setState({isSubmiting: true}, async () => {
            await axios.put("http://localhost:8080/survey", this.state.surveyAnswer)
            this.setState({isSubmiting: false, isSubmitted: true}, () => {
                setTimeout( () => {
                    this.setState( () => ({
                        isSubmitted: false
                  }));
                }, 4000);
            })
        })
       
    }

    render() {
        return(
            <Container>
            {this.state.isLoading === false && (
                <div>
                    <h1><b>Interview survey</b></h1>
                    {this.state.survey.pages.map((surveypage) => {
                    return <Box style={{paddingBottom: "20px"}}>
                    {surveypage.questions.map((question) => {
                        
                       if(surveypage.conditions) {
                           return( <div>
                               {surveypage.conditions[0].test === 'lessthan'
                                && this.state.surveyAnswer[surveypage.conditions[0].question] &&
                                parseInt(surveypage.conditions[0].value) >= this.state.surveyAnswer[surveypage.conditions[0].question] &&
                                <div>
                                     <h3>{question.label}</h3>
                            <hr/>
                            {this.generateSurveyQuestions(question.name, question.type, question.range_min, question.range_max)}

                                </div>

                               }
                               {surveypage.conditions[0].test === 'greaterthan' &&
                               this.state.surveyAnswer[surveypage.conditions[0].question] &&
                               parseInt(surveypage.conditions[0].value) <= this.state.surveyAnswer[surveypage.conditions[0].question] &&
                               <div>
                               <h3>{question.label}</h3>
                      <hr/>
                        {this.generateSurveyQuestions(question.name, question.type, question.range_min, question.range_max)}
                        </div>
                        
                        }

                           </div>)
                     
                       }
                       else {
                        return <div key={question.id}>
                            <h3>{question.label}</h3>
                            <hr/>
                            {this.generateSurveyQuestions(question.name, question.type, question.range_min, question.range_max)}
                            
                        </div>
                        }
                        
                        
                    
            
                    })}
                </Box>
                })}
                </div>
                )}
                {this.state.isLoading && (
                        <Spinner size="xl" />)
                            
                    }
                    <hr/>
                <div>
                    <div style={{paddingTop: "20px"}}>
                    
                    <Button loadingText="Saving..." isLoading={this.state.isSubmiting} disabled={this.state.isSubmiting} onClick={() => this.submitSurvey()} loading={this.state.isSubmiting} leftIcon={<CheckIcon/>} colorScheme="blue">Send answers</Button>
                    </div>
                </div>
                {this.state.isSubmitted && 
                      <Alert style={{paddingTop: "10px"}} status="success">
                      <AlertIcon />
                        {this.state.survey.thank_you_text}
                    </Alert>
                }
                    </Container>

        );
                }
            }
                    
                