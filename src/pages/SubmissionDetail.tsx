import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAssessment } from '@/hooks/useSingleAssessment';
import {
    Clock,
    User,
    Monitor,
    CheckCircle,
    XCircle,
    Calendar,
    MapPin,
    Users,
    BookOpen,
    Activity,
    Eye,
    Timer,
    Network,
    Shield,
} from 'lucide-react';
import type { Submission } from '@/types/types';





const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed': return 'bg-green-500';
        case 'pending': return 'bg-yellow-500';
        case 'auto locked': return 'bg-red-500';
        case 'in progress': return 'bg-blue-500';
        default: return 'bg-gray-500';
    }
};

const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
        case 'good': return 'text-green-600';
        case 'poor': return 'text-red-600';
        case 'fair': return 'text-yellow-600';
        default: return 'text-gray-600';
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};



const SubmissionDetailDialog = ({ submission, onClose }: { submission: any, onClose: () => void }) => {
    if (!submission) return null;
    if (!submission || submission.length === 0) return null;

    const assessmentId = submission[0].assessmentId;
    const { data: assessment,  } = useAssessment(assessmentId);
    console.log("assessment", assessment);

    return (
        <Dialog open={!!submission} onOpenChange={onClose}>
            <DialogContent className="min-w-[95%] max-h-3/4 overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Submission Details</DialogTitle>
                </DialogHeader>


                <div className=" bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Assessment Management
                            </h1>
                            <p className="text-slate-600">Comprehensive view of exam submissions and analytics</p>
                        </div>
                        {
                            assessment && (
                                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="bg-gray-50 text-black rounded-t-lg">
                                        <CardTitle className="flex items-center gap-2 text-2xl">
                                            <BookOpen className="h-6 w-6" />
                                            {assessment.assessmentName}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600">Course</p>
                                                    <p className="font-semibold">{assessment.course}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <MapPin className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600">Area</p>
                                                    <p className="font-semibold">{assessment.area}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Users className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600">Group</p>
                                                    <p className="font-semibold">{assessment.group}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                    <Calendar className="h-5 w-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600">Status</p>
                                                    <Badge className={`${getStatusColor(assessment.examStatus)} text-white`}>
                                                        {assessment.examStatus}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <p className="text-sm text-slate-600 flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Start Date
                                                </p>
                                                <p className="font-medium">{formatDate(assessment.startDate)}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-slate-600 flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    End Date
                                                </p>
                                                <p className="font-medium">{formatDate(assessment.endDate)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                            )
                        }

                        {/* Submissions */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Student Submissions ({submission.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-6">
                                <div className="grid gap-3 sm:gap-4">
                                    {submission.map((submission: Submission) => (
                                        <Card key={submission.id} className="border border-slate-200 hover:shadow-md transition-all duration-200">
                                            <CardContent className="p-3 sm:p-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-50 flex-shrink-0">
                                                            <AvatarFallback className="text-white font-semibold text-sm sm:text-base">
                                                                {typeof submission.user === 'string' ? submission.user.split(' ').map((n: string) => n[0]).join('').toUpperCase() : ''}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-semibold text-base sm:text-lg truncate">{submission.user}</h3>
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-slate-600">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                                    <span className="truncate">{formatDate(submission.loginTime)}</span>
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                                    <span className="truncate">{submission.area}</span>
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                                    <span className="truncate">{submission.group}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                                                        <Badge className={`${getStatusColor(submission.status)} text-white text-xs sm:text-sm px-2 py-1`}>
                                                            {submission.status}
                                                        </Badge>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                                                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                    <span className="hidden xs:inline">View Details</span>
                                                                    <span className="xs:hidden">View</span>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                                                                <DialogHeader>
                                                                    <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
                                                                        <User className="h-5 w-5 sm:h-6 sm:w-6" />
                                                                        <span className="truncate">{submission.user} - Detailed Report</span>
                                                                    </DialogTitle>
                                                                </DialogHeader>

                                                                <Tabs defaultValue="general" className="min-w-1/2">
                                                                    <div className='w-full overflow-x-auto'>
                                                                        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 h-auto min-w-[300px] w-full">
                                                                            <TabsTrigger value="general" className="flex-1 min-w-[70px] text-xs sm:text-sm px-2 sm:px-3">
                                                                                <span className="hidden sm:inline">General Info</span>
                                                                                <span className="sm:hidden">General</span>
                                                                            </TabsTrigger>
                                                                            <TabsTrigger value="session" className="flex-1 min-w-[70px] text-xs sm:text-sm px-2 sm:px-3">
                                                                                <span className="hidden sm:inline">Session Health</span>
                                                                                <span className="sm:hidden">Session</span>
                                                                            </TabsTrigger>
                                                                            <TabsTrigger value="technical" className="flex-1 min-w-[70px] text-xs sm:text-sm px-2 sm:px-3">
                                                                                <span className="hidden sm:inline">Technical</span>
                                                                                <span className="sm:hidden">Tech</span>
                                                                            </TabsTrigger>
                                                                            <TabsTrigger value="logs" className="flex-1 min-w-[70px] text-xs sm:text-sm px-2 sm:px-3">
                                                                                <span className="hidden sm:inline">Activity Logs</span>
                                                                                <span className="sm:hidden">Logs</span>
                                                                            </TabsTrigger>
                                                                        </TabsList>
                                                                    </div>

                                                                    <TabsContent value="general" className="space-y-3 sm:space-y-4 mt-4 mix-w-/2">
                                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                                                            <Card className="p-3 sm:p-4">
                                                                                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                                                    <User className="h-4 w-4" />
                                                                                    Student Information
                                                                                </h4>
                                                                                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                                                                    <p><strong>Full Name:</strong> <span className="break-words">{submission.user}</span></p>
                                                                                    <p><strong>Examinee ID:</strong> {submission.id}</p>
                                                                                    <p><strong>Group:</strong> {submission.group}</p>
                                                                                    <p><strong>Area:</strong> {submission.area}</p>
                                                                                    <p><strong>Version:</strong> {submission.version}</p>
                                                                                </div>
                                                                            </Card>

                                                                            <Card className="p-3 sm:p-4">
                                                                                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                                                    <Activity className="h-4 w-4" />
                                                                                    Exam Progress
                                                                                </h4>
                                                                                <div className="space-y-2 sm:space-y-3">
                                                                                    <div>
                                                                                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                                                                                            <span>Questions Solved</span>
                                                                                            <span>{submission.questionsSolved}/{submission.questionSynced}</span>
                                                                                        </div>
                                                                                        <Progress value={(submission.questionsSolved / submission.questionSynced) * 100} className="h-2" />
                                                                                    </div>
                                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                                                                                        <p><strong>Time Spent:</strong> <span className="break-words">{submission.timeSpent}</span></p>
                                                                                        <p><strong>Time Elapsed:</strong> <span className="break-words">{submission.timeElapsed}</span></p>
                                                                                        <p><strong>Started:</strong> {submission.started ? 'Yes' : 'No'}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </Card>
                                                                        </div>
                                                                    </TabsContent>

                                                                    <TabsContent value="session" className="space-y-3 sm:space-y-4 mt-4">
                                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                                                            <Card className="p-3 sm:p-4">
                                                                                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                                                    <Activity className="h-4 w-4" />
                                                                                    Session Health Overview
                                                                                </h4>
                                                                                <div className="space-y-2 sm:space-y-3">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <span className="text-xs sm:text-sm">Overall Health:</span>
                                                                                        <Badge className={`${getHealthColor(submission.overallSessionHealth)} bg-transparent border text-xs sm:text-sm`}>
                                                                                            {submission.overallSessionHealth}
                                                                                        </Badge>
                                                                                    </div>
                                                                                    <Separator />
                                                                                    <div className="space-y-2 sm:space-y-3">
                                                                                        <div>
                                                                                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                                                                                                <span>Status Score</span>
                                                                                                <span>{submission.statusScore}/100</span>
                                                                                            </div>
                                                                                            <Progress value={submission.statusScore} className="h-2" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                                                                                                <span>Timers Score</span>
                                                                                                <span>{submission.timersScore}/100</span>
                                                                                            </div>
                                                                                            <Progress value={submission.timersScore} className="h-2" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                                                                                                <span>Logs Score</span>
                                                                                                <span>{submission.logsScore}/100</span>
                                                                                            </div>
                                                                                            <Progress value={submission.logsScore} className="h-2" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                                                                                                <span>Results Score</span>
                                                                                                <span>{submission.resultsScore}/100</span>
                                                                                            </div>
                                                                                            <Progress value={submission.resultsScore} className="h-2" />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Card>

                                                                            <Card className="p-3 sm:p-4">
                                                                                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                                                    <Network className="h-4 w-4" />
                                                                                    Connection Details
                                                                                </h4>
                                                                                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <span>Connection Loss:</span>
                                                                                        {submission.connectionLoss === 'Yes' ?
                                                                                            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" /> :
                                                                                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                                                                        }
                                                                                    </div>
                                                                                    <p><strong>Offline Time:</strong> <span className="break-words">{submission.offlineTime}</span></p>
                                                                                    <p><strong>IP Address:</strong> <span className="break-all">{submission.ips}</span></p>
                                                                                </div>
                                                                            </Card>
                                                                        </div>
                                                                    </TabsContent>

                                                                    <TabsContent value="technical" className="space-y-3 sm:space-y-4 mt-4">
                                                                        <Card className="p-3 sm:p-4">
                                                                            <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                                                <Monitor className="h-4 w-4" />
                                                                                Technical Information
                                                                            </h4>
                                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                                                                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                                                                    <p><strong>Browser:</strong> <span className="break-words">{submission.browser}</span></p>
                                                                                    <p><strong>Packages Detected:</strong> {submission.packagesDetected}</p>
                                                                                    <p><strong>Questions Synced:</strong> {submission.questionSynced}</p>
                                                                                </div>
                                                                                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                                                                    <p><strong>IP Address:</strong> <span className="break-all">{submission.ips}</span></p>
                                                                                    <p><strong>Login Time:</strong> <span className="break-words">{formatDate(submission.loginTime)}</span></p>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                                        <span><strong>Security Status:</strong> Normal</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Card>
                                                                    </TabsContent>

                                                                    <TabsContent value="logs" className="space-y-3 sm:space-y-4 mt-4">
                                                                        <Card className="p-3 sm:p-4">
                                                                            <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                                                <Clock className="h-4 w-4" />
                                                                                Activity Timeline
                                                                            </h4>
                                                                            <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
                                                                                {submission.logs.map((log, index) => (
                                                                                    <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg">
                                                                                        <div className="p-1 sm:p-2 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                                                                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                                                        </div>
                                                                                        <div className="min-w-0 flex-1">
                                                                                            <p className="font-medium text-xs sm:text-sm break-words">{log.event}</p>
                                                                                            <p className="text-xs text-slate-600 break-words">{formatDate(log.timestamp)}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </Card>
                                                                    </TabsContent>
                                                                </Tabs>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </div>

                                                <Separator className="my-2 sm:my-3" />

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                                                        <span className="truncate">Solved: {submission.questionsSolved}/{submission.questionSynced}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Timer className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                                                        <span className="truncate">Time: {submission.timeSpent}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                                                        <span className="truncate">{submission.browser}</span>
                                                    </div>
                                                    <div className={`flex items-center gap-2 ${getHealthColor(submission.overallSessionHealth)}`}>
                                                        <Activity className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                        <span className="truncate">Health: {submission.overallSessionHealth}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SubmissionDetailDialog;
