import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approved-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService){}

    @Get()
    getEstimate(@Query() query: GetEstimateDto){
        return this.reportsService.createEstimate(query)
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() createReportDto: CreateReportDto, @CurrentUser() user: User){
        return this.reportsService.create(createReportDto, user)
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') reportId: string, @Body() body: ApproveReportDto){
        return this.reportsService.updateApproved(parseInt(reportId), body.approved)
    }
}
